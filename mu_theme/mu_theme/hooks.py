app_name = "mu_theme"
app_title = "MU Theme"
app_publisher = "MUBTKIR"
app_description = "Enhanced User Interface and User Experience for Frappe Applications"
app_email = "support@nextash.com"
app_license = "gpl-2.0"
# required_apps = []

app_logo_url = "/assets/mu_theme/images/small_icon.ico"

website_context = {
    "favicon": "/assets/mu_theme/images/small_icon.ico",
    "splash_image": "/assets/mu_theme/images/small_icon.ico",
}

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
app_include_css = ["mu_theme.bundle.css"]
app_include_js = ["mu_theme.bundle.js"]

# include js, css files in header of web template
# web_include_css = "/assets/mu_theme/css/mu_theme.css"
# web_include_js = "/assets/mu_theme/js/mu_theme.js"

# include custom scss in every website theme (without file extension ".scss")
# website_theme_scss = "mu_theme/public/scss/website"

# include js, css files in header of web form
# webform_include_js = {"doctype": "public/js/doctype.js"}
# webform_include_css = {"doctype": "public/css/doctype.css"}

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
doctype_js = {
    "Calendar View" : "public/js/mu_theme/calendar_view.js",
}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Svg Icons
# ------------------
# include app icons in desk
# app_include_icons = "mu_theme/public/icons.svg"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
# 	"Role": "home_page"
# }

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Jinja
# ----------

# add methods and filters to jinja environment
# jinja = {
# 	"methods": "mu_theme.utils.jinja_methods",
# 	"filters": "mu_theme.utils.jinja_filters"
# }

# Installation
# ------------

# before_install = "mu_theme.install.before_install"
# after_install = "mu_theme.install.after_install"

# Uninstallation
# ------------

# before_uninstall = "mu_theme.uninstall.before_uninstall"
# after_uninstall = "mu_theme.uninstall.after_uninstall"

# Integration Setup
# ------------------
# To set up dependencies/integrations with other apps
# Name of the app being installed is passed as an argument

# before_app_install = "mu_theme.utils.before_app_install"
# after_app_install = "mu_theme.utils.after_app_install"

# Integration Cleanup
# -------------------
# To clean up dependencies/integrations with other apps
# Name of the app being uninstalled is passed as an argument

# before_app_uninstall = "mu_theme.utils.before_app_uninstall"
# after_app_uninstall = "mu_theme.utils.after_app_uninstall"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "mu_theme.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# DocType Class
# ---------------
# Override standard doctype classes

# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"mu_theme.tasks.all"
# 	],
# 	"daily": [
# 		"mu_theme.tasks.daily"
# 	],
# 	"hourly": [
# 		"mu_theme.tasks.hourly"
# 	],
# 	"weekly": [
# 		"mu_theme.tasks.weekly"
# 	],
# 	"monthly": [
# 		"mu_theme.tasks.monthly"
# 	],
# }

# Testing
# -------

# before_tests = "mu_theme.install.before_tests"

# Overriding Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "mu_theme.event.get_events"
# }
#
# each overriding function accepts a standard args and kwargs, that are the same for the actual implementation
# NOTE: if you are overriding a doctype method, make sure to also override the corresponding
# DOCTYPE using override_doctype_class

# override document class methods
# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Custom fields
# ----------------
# Fields to add to existing doctypes
# custom_fields = {
# 	"User": [
# 		dict(fieldname='dashboard_url', label='Dashboard URL',
# 			fieldtype='Data', insert_after='last_name',
# 			default="/go/crm")
# 	]
# }

website_route_rules = [
    {"from_route": "/login", "to_route": "mu_theme/login"},
]
