# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE

import json
import os
import re
from urllib.parse import urlencode

import frappe
import frappe.sessions
from frappe import _
from frappe.utils.jinja_globals import is_rtl

from mu_theme.events.sidebar import get_desktop_pages

no_cache = 1

SCRIPT_TAG_PATTERN = re.compile(r"\<script[^<]*\</script\>")
CLOSING_SCRIPT_TAG_PATTERN = re.compile(r"</script\>")


def get_context(context):
	if frappe.session.user == "Guest":
		frappe.response["status_code"] = 403
		frappe.msgprint(_("Log in to access this page."))
		frappe.redirect(f"/login?{urlencode({'redirect-to': frappe.request.path})}")
	elif frappe.db.get_value("User", frappe.session.user, "user_type", order_by=None) == "Website User":
		frappe.throw(_("You are not permitted to access this page."), frappe.PermissionError)

	hooks = frappe.get_hooks()
	try:
		boot = frappe.sessions.get()
	except Exception as exc:
		raise frappe.SessionBootFailed from exc

	csrf_token = frappe.sessions.get_csrf_token()
	frappe.db.commit()

	boot_json = frappe.as_json(boot, indent=None, separators=(",", ":"))
	boot_json = SCRIPT_TAG_PATTERN.sub("", boot_json)
	boot_json = CLOSING_SCRIPT_TAG_PATTERN.sub("", boot_json)

	include_js = hooks.get("app_include_js", []) + frappe.conf.get("app_include_js", [])
	include_css = hooks.get("app_include_css", []) + frappe.conf.get("app_include_css", [])
	include_icons = hooks.get("app_include_icons", [])

	if hasattr(frappe.local, "preload_assets") and frappe.local.preload_assets is not None:
		frappe.local.preload_assets.setdefault("icons", []).extend(include_icons)

	if frappe.get_system_settings("enable_telemetry") and os.getenv("FRAPPE_SENTRY_DSN"):
		include_js.append("sentry.bundle.js")

	theme_settings = frappe.get_single("Theme Settings")
	primary = theme_settings.get("primary_color") or "#060960"
	secondary = theme_settings.get("secondary_color") or "#5EB182"
	allowed_skins = {"razor", "echo", "exort", "dagger", "ravage", "hook", "viper", "shuriken", "raze", "havoc", "hurricane"}
	skin_name = theme_settings.get("skin") or "razor"
	if skin_name not in allowed_skins:
		skin_name = "razor"

	try:
		sidebar_pages = get_desktop_pages()
	except Exception:
		# A sidebar API change must not prevent Desk from loading.
		frappe.log_error(frappe.get_traceback(), "MU Theme sidebar loading failed")
		sidebar_pages = []

	app_name = (
		theme_settings.get("title")
		or frappe.get_website_settings("app_name")
		or frappe.get_system_settings("app_name")
		or frappe.db.get_default("Company")
		or "MUBTKIR"
	)

	context.update(
		{
			"no_cache": 1,
			"build_version": frappe.utils.get_build_version(),
			"include_js": include_js,
			"include_css": include_css,
			"include_icons": include_icons,
			"layout_direction": "rtl" if is_rtl() else "ltr",
			"lang": frappe.local.lang,
			"sounds": hooks.get("sounds", []),
			# Frappe v15 expects an object here, not an already encoded JSON string.
			"boot": boot if context.get("for_mobile") else json.loads(boot_json),
			"desk_theme": boot.get("desk_theme") or "Light",
			"csrf_token": csrf_token,
			"google_analytics_id": frappe.conf.get("google_analytics_id"),
			"google_analytics_anonymize_ip": frappe.conf.get("google_analytics_anonymize_ip"),
			"app_name": app_name,
			"favicon": theme_settings.get("favicon_image") or "/assets/mu_theme/images/small_icon.ico",
			"theme_settings": theme_settings,
			"primary": primary,
			"secondary": secondary,
			"color_theme_1": hex_to_rgb(primary, "#060960"),
			"color_theme_2": hex_to_rgb(secondary, "#5EB182"),
			"skin_name": skin_name,
			"sidebar_pages": sidebar_pages,
		}
	)
	return context


def hex_to_rgb(hex_color, fallback):
	value = (hex_color or fallback).strip().lstrip("#")
	if len(value) == 3:
		value = "".join(char * 2 for char in value)
	if len(value) != 6 or any(char not in "0123456789abcdefABCDEF" for char in value):
		value = fallback.lstrip("#")
	return " ".join(str(int(value[index:index + 2], 16)) for index in (0, 2, 4))
