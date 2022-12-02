import Script from "next/script";
export default function Map({
  location = { lat: 0, lon: 0 },
  onChange = () => {},
}) {
  return (
    <>
      <Script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=requestAnimationFrame,Element.prototype.classList,URL" />
      <Script src="https://static.neshan.org/sdk/openlayers/5.3.0/ol.js" />
      <Script
        src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js"
        onReady={() => {
          var DrawFeature = new ol.source.Vector();

          var myMap = new ol.Map({
            target: "map",
            key: "web.15240cbe0eb345e098821548d24a9f52",
            view: new ol.View({
              center: ol.proj.fromLonLat([51.338076, 35.699756]),
              zoom: 14,
            }),
          });
          myMap.setMapType("dreamy");

          var markers = new ol.layer.Vector({
            source: DrawFeature,
            style: new ol.style.Style({
              image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                src: "/images/location.png",
              }),
            }),
          });

          var getPosition = {
            enableHighAccuracy: true,
            timeout: 9000,
            maximumAge: 0,
          };

          function success(gotPosition) {
            var uLat = location.lat || gotPosition.coords.latitude;
            var uLon = location.lon || gotPosition.coords.longitude;

            myMap.setView(
              new ol.View({
                center: ol.proj.fromLonLat([uLon, uLat]),
                zoom: 14,
              })
            );
            //automatically set the location for the user
            var marker = new ol.Feature(
              new ol.geom.Point(ol.proj.fromLonLat([uLon, uLat]))
            );
            markers.getSource().addFeature(marker);
            myMap.addLayer(markers);
          }

          function error(err) {
            console.log("ERROR" + err.code + "---" + err.message);
            success();
          }

          navigator.geolocation.getCurrentPosition(success, error, getPosition);

          myMap.on("singleclick", function (evt) {
            DrawFeature.clear();
            var lonlat = ol.proj.transform(
              evt.coordinate,
              "EPSG:3857",
              "EPSG:4326"
            );

            onChange({
              lat: lonlat[1],
              lon: lonlat[0],
            });

            var marker = new ol.Feature(
              new ol.geom.Point(ol.proj.fromLonLat(lonlat))
            );
            markers.getSource().addFeature(marker);
            myMap.addLayer(markers);
          });
        }}
      />
      <link
        href="https://static.neshan.org/sdk/openlayers/5.3.0/ol.css"
        rel="stylesheet"
        key="test"
      />

      <div id="map" className="w-full h-full">
        <div id="popup"></div>
      </div>
    </>
  );
}
