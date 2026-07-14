window.onload = function() {
  //<editor-fold desc="Changeable Configuration Block">

  // the following lines will be replaced by docker/configurator, when it runs in a docker-container
  window.ui = SwaggerUIBundle({
    urls: [
      { url: "../../openapi/ogc-common.yaml", name: "ogc-common" },
      { url: "../../openapi/ogc-coverage.yaml", name: "ogc-coverage" },
      { url: "../../openapi/ogc-features.yaml", name: "ogc-features" },
      { url: "../../openapi/ogc-maps.yaml", name: "ogc-maps" },
      { url: "../../openapi/ogc-processes.yaml", name: "ogc-processes" },
      { url: "../../openapi/ogc-routes.yaml", name: "ogc-routes" },
      { url: "../../openapi/ogc-schemas.yaml", name: "ogc-schemas" },
      { url: "../../openapi/robots.yaml", name: "robots" },
      { url: "../../ogc_official_examples/OGC-ogcapi-common-1-example-1-1.0.0-unresolved.yaml", name: "ogc-example-common-1-1.0.0-unresolved" },
      { url: "../../ogc_official_examples/OGC-ogcapi-features-1-example-1-1.0.1-unresolved.yaml", name: "ogc-example-features-1-1.0.1-unresolved" },
      { url: "../../ogc_official_examples/OGC-ogcapi-features-3-example-1-1.0.0-unresolved.yaml", name: "ogc-example-features-3-1.0.0-unresolved" },
      { url: "../../ogc_official_examples/OGC-ogcapi-maps-1-example-1-1.0.0-unresolved.yaml", name: "ogc-example-maps-1-1.0.0-unresolved" },
      { url: "../../ogc_official_examples/OGC-ogcapi-movingfeatures-1-example-1-1.0.0-unresolved.yaml", name: "ogc-example-movingfeatures-1-1.0.0-unresolved" },
      { url: "../../ogc_official_examples/OGC-ogcapi-processes-1-example-1-1.0.0-unresolved.yaml", name: "ogc-example-processes-1-1.0.0-unresolved" },
      { url: "../../ogc_official_examples/ogcapi-features-2.yaml", name: "ogc-example-features-2" }
    ],
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
