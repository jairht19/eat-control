/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
const navigationRoute = new NavigationRoute(createHandlerBoundToURL('/index.html'), {
    denylist: [/^\/api\//]
});
registerRoute(navigationRoute);
