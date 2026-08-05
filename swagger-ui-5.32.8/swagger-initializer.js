window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">

  // the following lines will be replaced by docker/configurator, when it runs in a docker-container
  var selectedSpec = new URLSearchParams(window.location.search).get("spec");

  window.ui = SwaggerUIBundle({
    urls: [
      { url: "../spatial/syriusorbit.yaml", name: "SyriusOrbit Spatial API" },
      { url: "../fleet-management/openapi.yaml", name: "SyriusOrbit Fleet Management API" }
    ],
    "urls.primaryName": selectedSpec === "fleet-management" ? "SyriusOrbit Fleet Management API" : "SyriusOrbit Spatial API",
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  });

  //</editor-fold>
};
