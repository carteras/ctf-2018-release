"use strict"
define("lynel/adapters/application",["exports","ember-data","ember-simple-auth/mixins/data-adapter-mixin"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.RESTAdapter.extend(n.default,{namespace:"api",authorizer:"authorizer:application"})}),define("lynel/adapters/user",["exports","ember-data","ember-simple-auth/mixins/data-adapter-mixin"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.RESTAdapter.extend(n.default,{namespace:"api",ajax:Ember.inject.service("ajax"),queryRecord:function(){return this.get("ajax").request("/api/user/current_user?cache_buster="+Math.random())},updateRecord:function(e,t,n){var i={}
e.serializerFor(t.modelName).serializeIntoHash(i,t,n)
var r="/api/user/current_user?cache_buster="+Math.random()
return this.get("ajax").put(r,{data:i})}})}),define("lynel/app",["exports","lynel/resolver","ember-load-initializers","lynel/config/environment"],function(e,t,n,i){Object.defineProperty(e,"__esModule",{value:!0})
var r=Ember.Application.extend({modulePrefix:i.default.modulePrefix,podModulePrefix:i.default.podModulePrefix,Resolver:t.default});(0,n.default)(r,i.default.modulePrefix),e.default=r}),define("lynel/authenticators/forgot",["exports","ember-simple-auth/authenticators/oauth2-password-grant","lynel/config/environment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.extend({ajax:Ember.inject.service(),serverTokenEndpoint:n.default.torii.providers.forgot.tokenExchangeUri})}),define("lynel/authenticators/signin",["exports","ember-simple-auth/authenticators/oauth2-password-grant","lynel/config/environment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.extend({ajax:Ember.inject.service(),serverTokenEndpoint:n.default.torii.providers["local-signin"].tokenExchangeUri})}),define("lynel/authenticators/signup",["exports","ember-simple-auth/authenticators/oauth2-password-grant","lynel/config/environment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.extend({ajax:Ember.inject.service(),serverTokenEndpoint:n.default.torii.providers["local-signup"].tokenExchangeUri})}),define("lynel/authenticators/torii",["exports","ember-simple-auth/authenticators/torii"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.extend({})}),define("lynel/authorizers/application",["exports","ember-simple-auth/authorizers/oauth2-bearer"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.extend({})}),define("lynel/components/menu-bar",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Component.extend({session:Ember.inject.service("session"),currentUser:Ember.inject.service("current-user"),init:function(){this._super.apply(this,arguments)},actions:{logout:function(){return this.get("currentUser").logout()}}})}),define("lynel/components/notification-container",["exports","ember-cli-notifications/components/notification-container"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("lynel/components/notification-message",["exports","ember-cli-notifications/components/notification-message","lynel/config/environment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0})
var i=n.default["ember-cli-notifications"]||{}
e.default=t.default.extend({icons:i.icons||"font-awesome"})}),define("lynel/components/torii-iframe-placeholder",["exports","torii/components/torii-iframe-placeholder"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("lynel/controllers/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend({session:Ember.inject.service("session"),currentUser:Ember.inject.service("current-user"),route:Ember.computed("currentPath",function(){return this.get("currentPath").split(".").join("-")}),actions:{logout:function(){this.get("session").invalidate()}}})}),define("lynel/controllers/index",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend({currentUser:Ember.inject.service("current-user"),actions:{}})}),define("lynel/controllers/login/forgot",["exports","lynel/mixins/validator"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend(t.default,{notifications:Ember.inject.service("notemsg"),queryParams:["token"],actions:{forgot:function(){var e=this
if(this.check_password()){var t=this.get("password"),n=this.get("token")
this.get("session").authenticate("authenticator:forgot",n,t).then(function(){},function(t){e.get("notifications").error(t.error)})}}}})}),define("lynel/controllers/login/index",["exports","lynel/mixins/validator","ember-ajax/services/ajax"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend(t.default,{notifications:Ember.inject.service("notemsg"),action:"signin",actions:{signin:function(){var e=this,t=this.get("email"),n=this.get("password")
this.get("session").authenticate("authenticator:signin",t,n).then(function(){},function(t){e.get("notifications").error(t.error?t.error:t)})},signup:function(){var e=this
if(this.check_email()&&this.check_password()){var t=this.get("email"),n=this.get("password")
this.get("session").authenticate("authenticator:signup",t,n).then(function(){},function(t){e.get("notifications").error(t.error?t.error:t)})}},forgot:function(){var e=this.get("email"),t=this
this.check_email()&&(new n.default).request("/api/auth/forgot?email="+encodeURIComponent(e)).then(function(e){e.message?(t.get("notifications").success(e.message),t.transitionToRoute("/login/forgot")):t.get("notifications").error(e.error?e.error:e)})},goto_signup:function(){this.set("action","signup")},goto_forgot:function(){this.set("action","forgot")},goto_signin:function(){this.set("action","signin")}}})}),define("lynel/controllers/profile",["exports","lynel/mixins/validator"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Controller.extend(t.default,{notifications:Ember.inject.service("notemsg"),ajax:Ember.inject.service("ajax"),currentUser:Ember.inject.service("current-user"),email:Ember.computed.oneWay("model.email"),actions:{save:function(){var e=this
this.check_email()&&(this.get("bad_username")||this.get("ajax").put("/api/user/current_user",{data:{user:{name:this.get("model.name"),email:this.get("model.email"),comment:this.get("model.comment")}}}).then(function(t){t.error?e.get("notifications").error("Error saving profile: "+t.error):(e.get("notifications").success("Saved!"),e.get("currentUser").load().then(function(){e.transitionToRoute("index")}))}))},change_password:function(){var e=this
if(this.check_password())return this.get("ajax").post("/api/user/changepw",{data:{oldpw:this.get("old_password"),newpw:this.get("password")}}).then(function(t){t.message?e.get("notifications").success(t.message):e.get("notifications").error(t.error)})},check_username:function(){var e=this,t=this.get("model.name")
return this.set("bad_username",null),""==t&&this.set("bad_username","Username is required!"),t==this.get("currentUser.user.name")?null:this.get("ajax").request("/api/user/checkuser?name="+encodeURIComponent(t)).then(function(t){t.available?e.set("bad_username",null):e.set("bad_username","Name already in use!")})}}})}),define("lynel/helpers/and",["exports","ember-truth-helpers/helpers/and"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"and",{enumerable:!0,get:function(){return t.and}})}),define("lynel/helpers/app-version",["exports","lynel/config/environment","ember-cli-app-version/utils/regexp"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.appVersion=r
var i=t.default.APP.version
function r(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}
return t.hideSha?i.match(n.versionRegExp)[0]:t.hideVersion?i.match(n.shaRegExp)[0]:i}e.default=Ember.Helper.helper(r)}),define("lynel/helpers/eq",["exports","ember-truth-helpers/helpers/equal"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"equal",{enumerable:!0,get:function(){return t.equal}})}),define("lynel/helpers/gt",["exports","ember-truth-helpers/helpers/gt"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"gt",{enumerable:!0,get:function(){return t.gt}})}),define("lynel/helpers/gte",["exports","ember-truth-helpers/helpers/gte"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"gte",{enumerable:!0,get:function(){return t.gte}})}),define("lynel/helpers/is-array",["exports","ember-truth-helpers/helpers/is-array"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"isArray",{enumerable:!0,get:function(){return t.isArray}})}),define("lynel/helpers/is-equal",["exports","ember-truth-helpers/helpers/is-equal"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"isEqual",{enumerable:!0,get:function(){return t.isEqual}})}),define("lynel/helpers/local-class",["exports","ember-css-modules/helpers/local-class"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"localClass",{enumerable:!0,get:function(){return t.localClass}})}),define("lynel/helpers/lt",["exports","ember-truth-helpers/helpers/lt"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"lt",{enumerable:!0,get:function(){return t.lt}})}),define("lynel/helpers/lte",["exports","ember-truth-helpers/helpers/lte"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"lte",{enumerable:!0,get:function(){return t.lte}})}),define("lynel/helpers/not-eq",["exports","ember-truth-helpers/helpers/not-equal"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"notEq",{enumerable:!0,get:function(){return t.notEq}})}),define("lynel/helpers/not",["exports","ember-truth-helpers/helpers/not"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"not",{enumerable:!0,get:function(){return t.not}})}),define("lynel/helpers/or",["exports","ember-truth-helpers/helpers/or"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"or",{enumerable:!0,get:function(){return t.or}})})
define("lynel/helpers/pluralize",["exports","ember-inflector/lib/helpers/pluralize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("lynel/helpers/singularize",["exports","ember-inflector/lib/helpers/singularize"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("lynel/helpers/urlencode",["exports"],function(e){function t(e){return e}Object.defineProperty(e,"__esModule",{value:!0}),e.urlencode=t,e.default=Ember.Helper.helper(t)}),define("lynel/helpers/xor",["exports","ember-truth-helpers/helpers/xor"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"xor",{enumerable:!0,get:function(){return t.xor}})}),define("lynel/initializers/app-version",["exports","ember-cli-app-version/initializer-factory","lynel/config/environment"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0})
var i=void 0,r=void 0
n.default.APP&&(i=n.default.APP.name,r=n.default.APP.version),e.default={name:"App Version",initialize:(0,t.default)(i,r)}}),define("lynel/initializers/container-debug-adapter",["exports","ember-resolver/resolvers/classic/container-debug-adapter"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"container-debug-adapter",initialize:function(){var e=arguments[1]||arguments[0]
e.register("container-debug-adapter:main",t.default),e.inject("container-debug-adapter:main","namespace","application:main")}}}),define("lynel/initializers/data-adapter",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"data-adapter",before:"store",initialize:function(){}}}),define("lynel/initializers/ember-css-modules",["exports","ember-css-modules/initializers/ember-css-modules"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}}),Object.defineProperty(e,"initialize",{enumerable:!0,get:function(){return t.initialize}})}),define("lynel/initializers/ember-data",["exports","ember-data/setup-container","ember-data"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:t.default}}),define("lynel/initializers/ember-simple-auth",["exports","lynel/config/environment","ember-simple-auth/configuration","ember-simple-auth/initializers/setup-session","ember-simple-auth/initializers/setup-session-service","ember-simple-auth/initializers/setup-session-restoration"],function(e,t,n,i,r,a){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-simple-auth",initialize:function(e){var o=t.default["ember-simple-auth"]||{}
o.baseURL=t.default.rootURL||t.default.baseURL,n.default.load(o),(0,i.default)(e),(0,r.default)(e),(0,a.default)(e)}}}),define("lynel/initializers/export-application-global",["exports","lynel/config/environment"],function(e,t){function n(){var e=arguments[1]||arguments[0]
if(!1!==t.default.exportApplicationGlobal){var n
if("undefined"!=typeof window)n=window
else if("undefined"!=typeof global)n=global
else{if("undefined"==typeof self)return
n=self}var i,r=t.default.exportApplicationGlobal
i="string"==typeof r?r:Ember.String.classify(t.default.modulePrefix),n[i]||(n[i]=e,e.reopen({willDestroy:function(){this._super.apply(this,arguments),delete n[i]}}))}}Object.defineProperty(e,"__esModule",{value:!0}),e.initialize=n,e.default={name:"export-application-global",initialize:n}}),define("lynel/initializers/initialize-torii-callback",["exports","lynel/config/environment","torii/redirect-handler"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"torii-callback",before:"torii",initialize:function(e){arguments[1]&&(e=arguments[1]),t.default.torii&&t.default.torii.disableRedirectInitializer||(e.deferReadiness(),n.default.handle(window).catch(function(){e.advanceReadiness()}))}}}),define("lynel/initializers/initialize-torii-session",["exports","torii/bootstrap/session","torii/configuration"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"torii-session",after:"torii",initialize:function(e){arguments[1]&&(e=arguments[1])
var i=(0,n.getConfiguration)()
if(i.sessionServiceName){(0,t.default)(e,i.sessionServiceName)
var r="service:"+i.sessionServiceName
e.inject("adapter",i.sessionServiceName,r)}}}}),define("lynel/initializers/initialize-torii",["exports","torii/bootstrap/torii","torii/configuration","lynel/config/environment"],function(e,t,n,i){Object.defineProperty(e,"__esModule",{value:!0})
var r={name:"torii",initialize:function(e){arguments[1]&&(e=arguments[1]),(0,n.configure)(i.default.torii||{}),(0,t.default)(e),e.inject("route","torii","service:torii")}}
e.default=r}),define("lynel/initializers/injectStore",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"injectStore",before:"store",initialize:function(){}}}),define("lynel/initializers/notifications",["exports","ember-cli-notifications/services/notification-messages-service"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"notification-messages-service",initialize:function(){var e=arguments[1]||arguments[0]
if(Ember.Service)return e.register("service:notification-messages",t.default),e.inject("component:notification-container","notifications","service:notification-messages"),void e.inject("component:notification-message","notifications","service:notification-messages")
e.register("notification-messages:service",t.default),["controller","component","route","router","service"].forEach(function(t){e.inject(t,"notifications","notification-messages:service")})}}}),define("lynel/initializers/store",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"store",after:"ember-data",initialize:function(){}}}),define("lynel/initializers/transforms",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"transforms",before:"store",initialize:function(){}}}),define("lynel/instance-initializers/ember-data",["exports","ember-data/initialize-store-service"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"ember-data",initialize:t.default}}),define("lynel/instance-initializers/setup-routes",["exports","torii/bootstrap/routing","torii/configuration","torii/compat/get-router-instance","torii/compat/get-router-lib","torii/router-dsl-ext"],function(e,t,n,i,r){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"torii-setup-routes",initialize:function(e){if((0,n.getConfiguration)().sessionServiceName){var a=(0,i.default)(e)
a.on("willTransition",function n(){var i=(0,r.default)(a).authenticatedRoutes
!Ember.isEmpty(i)&&(0,t.default)(e,i),a.off("willTransition",n)})}}}}),define("lynel/instance-initializers/walk-providers",["exports","torii/lib/container-utils","torii/configuration"],function(e,t,n){Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"torii-walk-providers",initialize:function(e){var i=(0,n.getConfiguration)()
for(var r in i.providers)i.providers.hasOwnProperty(r)&&(0,t.lookup)(e,"torii-provider:"+r)}}}),define("lynel/mixins/validator",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Mixin.create({bad_email:Ember.computed("email",function(){var e=this.get("email")
return""==e?"Email is missing!":/\S+@\S+\.\S+/.test(e)?null:"Email doesn't look valid!"}),bad_password:Ember.computed("password","password_again",function(){var e=this.get("password"),t=this.get("password_again")
return e?e.length<8?"Passwords must be at least 8 characters":e.match(/^[a-z]*$/)?"Passwords must contain an uppercase or symbol":e!==t?"Passwords don't match!":null:"Password shouldn't be blank!"}),check_email:function(){var e=this.get("bad_email")
return!e||(this.get("notifications").error(e),Ember.$("#email").focus(),!1)},check_password:function(){var e=this.get("bad_password")
return!e||(this.get("notifications").error(e),Ember.$("#password").focus(),!1)}})}),define("lynel/models/user",["exports","ember-data"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.Model.extend({email:t.default.attr(),name:t.default.attr(),comment:t.default.attr()})}),define("lynel/resolver",["exports","ember-resolver"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("lynel/router",["exports","lynel/config/environment"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0})
var n=Ember.Router.extend({location:t.default.locationType,rootURL:t.default.rootURL})
n.map(function(){this.route("login",function(){this.route("forgot")}),this.route("profile")}),e.default=n}),define("lynel/routes/application",["exports","ember-simple-auth/mixins/application-route-mixin"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Route.extend(t.default,{notifications:Ember.inject.service("notemsg"),currentUser:Ember.inject.service("current-user"),_loadCurrentUser:function(){var e=this
return this.get("currentUser").load().catch(function(){return e.get("session").invalidate()})},beforeModel:function(){return this._loadCurrentUser()},sessionAuthenticated:function(){this._super.apply(this,arguments)
var e=this
return this._loadCurrentUser().then(function(){e.get("notifications").success("Logged in!"),e.transitionTo("/")})},sessionInvalidated:function(){this.set("currentUser.user",null),this.transitionTo("/login"),this.get("notifications").warning("Logged out!")},actions:{error:function(e){return this.get("notifications").error("Sorry, an error occurred: "+e.message+" (see console for more details)"),!0}}})}),define("lynel/routes/index",["exports","ember-simple-auth/mixins/authenticated-route-mixin"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Route.extend(t.default,{})}),define("lynel/routes/login",["exports","ember-simple-auth/mixins/unauthenticated-route-mixin"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Route.extend(t.default,{})}),define("lynel/routes/login/forgot",["exports","ember-simple-auth/mixins/unauthenticated-route-mixin"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Route.extend(t.default,{})}),define("lynel/routes/login/index",["exports","ember-simple-auth/mixins/unauthenticated-route-mixin"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Route.extend(t.default,{})})
define("lynel/routes/login/signin",["exports","ember-simple-auth/mixins/unauthenticated-route-mixin"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Route.extend(t.default,{})}),define("lynel/routes/login/signup",["exports","ember-simple-auth/mixins/unauthenticated-route-mixin"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Route.extend(t.default,{})}),define("lynel/routes/profile",["exports","ember-simple-auth/mixins/authenticated-route-mixin"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Route.extend(t.default,{currentUser:Ember.inject.service("current-user"),model:function(){return{name:this.get("currentUser").get("user.name"),email:this.get("currentUser").get("user.email"),comment:this.get("currentUser").get("user.comment")}}})}),define("lynel/services/ajax",["exports","ember-ajax/services/ajax"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.extend({session:Ember.inject.service(),headers:Ember.computed("session.data.authenticated.access_token",{get:function(){var e={},t=this.get("session.data.authenticated.access_token")
return t&&(e.Authorization="Bearer "+t),e}})})}),define("lynel/services/cookies",["exports","ember-cookies/services/cookies"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("lynel/services/current-user",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.Service.extend({session:Ember.inject.service(),store:Ember.inject.service(),notifications:Ember.inject.service("notemsg"),ajax:Ember.inject.service("ajax"),user:null,init:function(){this._super.apply(this,arguments)},load:function(){var e=this
return this.get("session.isAuthenticated")?this.get("store").queryRecord("user",{}).then(function(t){e.set("user",t)}):Ember.RSVP.resolve(null)},logout:function(){this.get("session").invalidate()}})}),define("lynel/services/notemsg",["exports","ember-cli-notifications/services/notification-messages-service"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.extend({init:function(){this._super.apply(this,arguments),this.setDefaultAutoClear(!0)}})}),define("lynel/services/notification-messages-service",["exports","ember-cli-notifications/services/notification-messages-service"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("lynel/services/popup",["exports","torii/services/popup"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("lynel/services/session",["exports","ember-simple-auth/services/session"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default}),define("lynel/services/torii-session",["exports","torii/services/torii-session"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("lynel/services/torii",["exports","torii/services/torii"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),Object.defineProperty(e,"default",{enumerable:!0,get:function(){return t.default}})}),define("lynel/session-stores/application",["exports","ember-simple-auth/session-stores/adaptive"],function(e,t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=t.default.extend()}),define("lynel/templates/application",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"C6XZSXRA",block:'{"symbols":[],"statements":[[6,"div"],[9,"class","navbar"],[7],[0,"\\n  "],[1,[18,"menu-bar"],false],[0,"\\n"],[8],[0,"\\n"],[6,"div"],[10,"class",[26,["content route-",[18,"route"]]]],[7],[0,"\\n  "],[6,"div"],[9,"class","overlay"],[7],[0,"\\n"],[0,"    "],[1,[18,"notification-container"],false],[0,"\\n  "],[8],[0,"\\n\\n  "],[6,"div"],[10,"class",[26,["page-content route-",[18,"route"]]]],[7],[0,"\\n    "],[6,"div"],[9,"class","container"],[7],[0,"\\n      "],[6,"div"],[9,"class","starter-template"],[7],[0,"\\n        "],[1,[18,"outlet"],false],[0,"\\n      "],[8],[0,"\\n    "],[8],[2," /.container "],[0,"\\n  "],[8],[0,"\\n"],[8],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"lynel/templates/application.hbs"}})}),define("lynel/templates/components/menu-bar",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"HiULAmXd",block:'{"symbols":[],"statements":[[0,"\\n"],[6,"p"],[7],[4,"link-to",["index"],null,{"statements":[[0,"Home"]],"parameters":[]},null],[8],[0,"\\n\\n"],[2," Collect the nav links, forms, and other content for toggling "],[0,"\\n"],[4,"if",[[20,["session","isAuthenticated"]]],null,{"statements":[[0,"  "],[6,"p"],[7],[0,"You\'re currently logged in as "],[1,[20,["currentUser","user","name"]],false],[0,"! "],[4,"link-to",["profile"],null,{"statements":[[0,"Edit profile"]],"parameters":[]},null],[0," | "],[6,"a"],[9,"href","#"],[3,"action",[[19,0,[]],"logout"]],[7],[0,"Log out"],[8],[8],[0,"\\n"]],"parameters":[]},{"statements":[[0," "],[0,"\\n"],[6,"p"],[7],[0,"You are not logged in!"],[8],[0,"\\n"]],"parameters":[]}],[0," "],[2," /isAuthenticated "],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"lynel/templates/components/menu-bar.hbs"}})}),define("lynel/templates/index",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"1CCtaWjj",block:'{"symbols":[],"statements":[[6,"h2"],[7],[0,"Welcome, "],[4,"link-to",["profile"],null,{"statements":[[1,[20,["currentUser","user","name"]],false]],"parameters":[]},null],[0,"!"],[8],[0,"\\n\\n"],[6,"p"],[7],[0,"Your goal is to get the \\"comment\\" field from the \\"admin\\" profile. Good luck!"],[8],[0,"\\n\\n"],[6,"p"],[7],[0,"As always: bruteforcing isn\'t allowed, required, or helpful. :)"],[8],[0,"\\n\\n"],[1,[18,"outlet"],false],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"lynel/templates/index.hbs"}})}),define("lynel/templates/login",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"7pvIibB6",block:'{"symbols":[],"statements":[[6,"h1"],[7],[0,"Welcome!"],[8],[0,"\\n\\n"],[6,"p"],[7],[0,"Please sign in or create a new account to continue."],[8],[0,"\\n\\n"],[1,[18,"outlet"],false],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"lynel/templates/login.hbs"}})}),define("lynel/templates/login/forgot",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"d6WUTUMQ",block:'{"symbols":[],"statements":[[6,"form"],[3,"action",[[19,0,[]],"forgot"],[["on"],["submit"]]],[7],[0,"\\n  "],[6,"p"],[7],[0,"The token that was emailed to you: "],[1,[25,"input",null,[["value"],[[20,["token"]]]]],false],[8],[0,"\\n  "],[6,"p"],[7],[0,"New password: "],[1,[25,"input",null,[["value","type","id"],[[20,["password"]],"password","password"]]],false],[8],[0,"\\n  "],[6,"p"],[7],[0,"\\n    (again): "],[1,[25,"input",null,[["value","type","id"],[[20,["password_again"]],"password","password_again"]]],false],[0,"\\n"],[4,"if",[[20,["bad_password"]]],null,{"statements":[[0,"      "],[6,"span"],[9,"class","warning"],[7],[1,[18,"bad_password"],false],[8],[0,"\\n"]],"parameters":[]},null],[0,"  "],[8],[0,"\\n\\n  "],[6,"p"],[7],[6,"input"],[9,"type","submit"],[9,"value","Reset!"],[7],[8],[8],[0,"\\n"],[8],[0,"\\n"],[1,[18,"outlet"],false]],"hasEval":false}',meta:{moduleName:"lynel/templates/login/forgot.hbs"}})}),define("lynel/templates/login/index",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"pYswG3VQ",block:'{"symbols":[],"statements":[[4,"if",[[25,"eq",[[20,["action"]],"signin"],null]],null,{"statements":[[0,"  "],[6,"h2"],[7],[0,"Sign in to your account"],[8],[0,"\\n  "],[6,"p"],[7],[6,"a"],[9,"href","#"],[3,"action",[[19,0,[]],"goto_signup"]],[7],[0,"Register a new account"],[8],[8],[0,"\\n  "],[6,"p"],[7],[6,"a"],[9,"href","#"],[3,"action",[[19,0,[]],"goto_forgot"]],[7],[0,"Forgot password?"],[8],[8],[0,"\\n"]],"parameters":[]},{"statements":[[4,"if",[[25,"eq",[[20,["action"]],"signup"],null]],null,{"statements":[[0,"  "],[6,"h2"],[7],[0,"Register a new account"],[8],[0,"\\n  "],[6,"p"],[7],[6,"a"],[9,"href","#"],[3,"action",[[19,0,[]],"goto_signin"]],[7],[0,"Sign in to your account"],[8],[8],[0,"\\n  "],[6,"p"],[7],[6,"a"],[9,"href","#"],[3,"action",[[19,0,[]],"goto_forgot"]],[7],[0,"Forgot password?"],[8],[8],[0,"\\n"]],"parameters":[]},{"statements":[[4,"if",[[25,"eq",[[20,["action"]],"forgot"],null]],null,{"statements":[[0,"  "],[6,"h2"],[7],[0,"Forgot your password?"],[8],[0,"\\n  "],[6,"p"],[7],[6,"a"],[9,"href","#"],[3,"action",[[19,0,[]],"goto_signup"]],[7],[0,"Register a new account"],[8],[8],[0,"\\n  "],[6,"p"],[7],[6,"a"],[9,"href","#"],[3,"action",[[19,0,[]],"goto_signin"]],[7],[0,"Sign in to your account"],[8],[8],[0,"\\n"]],"parameters":[]},{"statements":[[0,"  "],[6,"h2"],[7],[0,"Ended up in a weird state, help? (state = "],[1,[25,"action",[[19,0,[]]],null],false],[0,")"],[8],[0,"\\n"]],"parameters":[]}]],"parameters":[]}]],"parameters":[]}],[0,"\\n\\n"],[4,"if",[[25,"eq",[[20,["action"]],"signin"],null]],null,{"statements":[[0,"  "],[6,"form"],[3,"action",[[19,0,[]],"signin"],[["on"],["submit"]]],[7],[0,"\\n    "],[6,"p"],[7],[0,"\\n      Email or username: "],[1,[25,"input",null,[["value","id"],[[20,["email"]],"email"]]],false],[0,"\\n    "],[8],[0,"\\n    "],[6,"p"],[7],[0,"Password: "],[1,[25,"input",null,[["value","type","id"],[[20,["password"]],"password","password"]]],false],[8],[0,"\\n\\n    "],[6,"p"],[7],[6,"input"],[9,"type","submit"],[9,"value","Sign in!"],[7],[8],[8],[0,"\\n  "],[8],[0,"\\n"]],"parameters":[]},{"statements":[[4,"if",[[25,"eq",[[20,["action"]],"signup"],null]],null,{"statements":[[0,"  "],[6,"form"],[3,"action",[[19,0,[]],"signup"],[["on"],["submit"]]],[7],[0,"\\n    "],[6,"p"],[7],[0,"\\n      Email: "],[1,[25,"input",null,[["value","id"],[[20,["email"]],"email"]]],false],[0,"\\n"],[4,"if",[[20,["bad_email"]]],null,{"statements":[[0,"        "],[6,"span"],[9,"class","warning"],[7],[1,[18,"bad_email"],false],[8],[0,"\\n"]],"parameters":[]},null],[0,"    "],[8],[0,"\\n    "],[6,"p"],[7],[0,"Password: "],[1,[25,"input",null,[["value","type","id"],[[20,["password"]],"password","password"]]],false],[8],[0,"\\n    "],[6,"p"],[7],[0,"\\n      Password (again): "],[1,[25,"input",null,[["value","type","id"],[[20,["password_again"]],"password","password_again"]]],false],[0,"\\n"],[4,"if",[[20,["bad_password"]]],null,{"statements":[[0,"        "],[6,"span"],[9,"class","warning"],[7],[1,[18,"bad_password"],false],[8],[0,"\\n"]],"parameters":[]},null],[0,"    "],[8],[0,"\\n    "],[6,"p"],[7],[6,"input"],[9,"type","submit"],[9,"value","Sign up!"],[7],[8],[8],[0,"\\n  "],[8],[0,"\\n"]],"parameters":[]},{"statements":[[4,"if",[[25,"eq",[[20,["action"]],"forgot"],null]],null,{"statements":[[0,"  "],[6,"form"],[3,"action",[[19,0,[]],"forgot"],[["on"],["submit"]]],[7],[0,"\\n    "],[6,"p"],[7],[0,"\\n      Email: "],[1,[25,"input",null,[["value","id"],[[20,["email"]],"email"]]],false],[0,"\\n"],[4,"if",[[20,["bad_email"]]],null,{"statements":[[0,"        "],[6,"span"],[9,"class","warning"],[7],[1,[18,"bad_email"],false],[8],[0,"\\n"]],"parameters":[]},null],[0,"    "],[8],[0,"\\n\\n    "],[6,"p"],[7],[6,"input"],[9,"type","submit"],[9,"value","Email me!"],[7],[8],[8],[0,"\\n  "],[8],[0,"\\n"]],"parameters":[]},null]],"parameters":[]}]],"parameters":[]}],[0,"\\n"],[1,[18,"outlet"],false],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"lynel/templates/login/index.hbs"}})}),define("lynel/templates/profile",["exports"],function(e){Object.defineProperty(e,"__esModule",{value:!0}),e.default=Ember.HTMLBars.template({id:"r4bCuuEt",block:'{"symbols":[],"statements":[[6,"h1"],[7],[0,"Profile for "],[6,"em"],[7],[1,[20,["currentUser","user","name"]],false],[8],[8],[0,"\\n\\n"],[6,"form"],[3,"action",[[19,0,[]],"save"],[["on"],["submit"]]],[7],[0,"\\n  "],[6,"p"],[7],[0,"Username: "],[1,[25,"input",null,[["value","change"],[[20,["model","name"]],[25,"action",[[19,0,[]],"check_username"],null]]]],false],[8],[0,"\\n\\n"],[4,"if",[[20,["bad_username"]]],null,{"statements":[[0,"    "],[6,"p"],[7],[6,"span"],[9,"class","warning"],[7],[1,[18,"bad_username"],false],[8],[8],[0,"\\n"]],"parameters":[]},null],[0,"\\n  "],[6,"p"],[7],[0,"\\n    Email: "],[1,[25,"input",null,[["value"],[[20,["model","email"]]]]],false],[0,"\\n"],[4,"if",[[20,["bad_email"]]],null,{"statements":[[0,"      "],[6,"span"],[9,"class","warning"],[7],[1,[18,"bad_email"],false],[8],[0,"\\n"]],"parameters":[]},null],[0,"  "],[8],[0,"\\n\\n  "],[6,"p"],[7],[0,"Comment: "],[1,[25,"input",null,[["value"],[[20,["model","comment"]]]]],false],[8],[0,"\\n\\n  "],[6,"p"],[7],[0,"\\n    "],[6,"input"],[9,"type","submit"],[9,"value","Save!"],[7],[8],[0,"\\n  "],[8],[0,"\\n\\n"],[8],[0,"\\n\\n"],[6,"h3"],[7],[0,"Change your password"],[8],[0,"\\n\\n"],[6,"form"],[3,"action",[[19,0,[]],"change_password"],[["on"],["submit"]]],[7],[0,"\\n  "],[6,"p"],[7],[0,"Old password: "],[1,[25,"input",null,[["value","type"],[[20,["old_password"]],"password"]]],false],[8],[0,"\\n  "],[6,"p"],[7],[0,"New password: "],[1,[25,"input",null,[["value","type"],[[20,["password"]],"password"]]],false],[8],[0,"\\n  "],[6,"p"],[7],[0,"\\n    Again: "],[1,[25,"input",null,[["value","type"],[[20,["password_again"]],"password"]]],false],[0,"\\n"],[4,"if",[[20,["bad_password"]]],null,{"statements":[[0,"      "],[6,"span"],[9,"class","warning"],[7],[1,[18,"bad_password"],false],[8],[0,"\\n"]],"parameters":[]},null],[0,"  "],[8],[0,"\\n  "],[6,"p"],[7],[6,"input"],[9,"type","submit"],[9,"value","Change password!"],[7],[8],[8],[0,"\\n"],[8],[0,"\\n\\n"],[1,[18,"outlet"],false],[0,"\\n"]],"hasEval":false}',meta:{moduleName:"lynel/templates/profile.hbs"}})}),define("lynel/config/environment",[],function(){try{var e="lynel/config/environment",t=document.querySelector('meta[name="'+e+'"]').getAttribute("content"),n={default:JSON.parse(unescape(t))}
return Object.defineProperty(n,"__esModule",{value:!0}),n}catch(t){throw new Error('Could not read config from meta tag with name "'+e+'".')}}),runningTests||require("lynel/app").default.create({name:"lynel",version:"0.0.0+17102650"})
