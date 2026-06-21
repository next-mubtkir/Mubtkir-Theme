# Copyright (c) 2015, Frappe Technologies Pvt. Ltd. and Contributors
# License: MIT. See LICENSE
import os

no_cache = 1

import json
import re

import frappe
import frappe.sessions
from frappe import _
from frappe.utils.jinja_globals import is_rtl
from mu_theme.events.sidebar import get_desktop_pages

SCRIPT_TAG_PATTERN = re.compile(r"\<script[^<]*\<\/script\>")
CLOSING_SCRIPT_TAG_PATTERN = re.compile(r"<\/script\>")




def get_context(context):
	if frappe.session.user == "Guest":
		frappe.throw(_("Log in to access this page."), frappe.PermissionError)
	elif frappe.db.get_value("User", frappe.session.user, "user_type", order_by=None) == "Website User":
		frappe.throw(_("You are not permitted to access this page."), frappe.PermissionError)


	hooks = frappe.get_hooks()
	try:
		boot = frappe.sessions.get()
	except Exception as e:
		raise frappe.SessionBootFailed from e


	# this needs commit
	csrf_token = frappe.sessions.get_csrf_token()


	frappe.db.commit()


	boot_json = frappe.as_json(boot, indent=None, separators=(",", ":"))
	boot_json = SCRIPT_TAG_PATTERN.sub("", boot_json)
	boot_json = CLOSING_SCRIPT_TAG_PATTERN.sub("", boot_json)

	include_js = hooks.get("app_include_js", []) + frappe.conf.get("app_include_js", [])
	include_css = hooks.get("app_include_css", []) + frappe.conf.get("app_include_css", [])
	include_icons = hooks.get("app_include_icons", [])

	context.update(
		{
			"no_cache": 1,
			"build_version": frappe.utils.get_build_version(),
			"include_js": include_js,
			"include_css": include_css,
			"include_icons": include_icons,
			"layout_direction": "rtl" if is_rtl() else "ltr",
			"lang": frappe.local.lang,
			"sounds": hooks.get("sounds"),
			"boot": boot if context.get("for_mobile") else boot_json,
			"desk_theme": boot.get("desk_theme") or "Light",
			"csrf_token": csrf_token,
			"google_analytics_id": (frappe.conf.get("google_analytics_id") or ""),
			"google_analytics_anonymize_ip": frappe.conf.get("google_analytics_anonymize_ip"),
			"mixpanel_id": frappe.conf.get("mixpanel_id") or "",
			"app_logo": frappe.get_website_settings("app_logo") or frappe.get_hooks("app_logo_url")[-1] or "/assets/mu_theme/images/shape.svg",
			"sidebar_pages": get_desktop_pages()
		}
	)


def hex_to_rgb(hex_color):
	hex_color = hex_color.lstrip("#")
	r = int(hex_color[0:2], 16)
	g = int(hex_color[2:4], 16)
	b = int(hex_color[4:6], 16)
	return f"{r}, {g}, {b}"
