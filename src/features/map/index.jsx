import Mapir from "mapir-react-component";
import "mapir-react-component/dist/index.css";

const Map = Mapir.setToken({
  transformRequest: (url) => {
    return {
      url: url,
      headers: {
        "x-api-key":
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjM5MGEzODQ2NTc1YTNjNGYwZmZmNTBmNWU4ZGJkNjRkMTQ3MmI1YzZkNThiMWRjNzZhZjc2NGE3ZTliYWMxZGM3NWJkN2QxOWI0ZWFmNWU4In0.eyJhdWQiOiIyMDQyMCIsImp0aSI6IjM5MGEzODQ2NTc1YTNjNGYwZmZmNTBmNWU4ZGJkNjRkMTQ3MmI1YzZkNThiMWRjNzZhZjc2NGE3ZTliYWMxZGM3NWJkN2QxOWI0ZWFmNWU4IiwiaWF0IjoxNjcxNTQwNDU0LCJuYmYiOjE2NzE1NDA0NTQsImV4cCI6MTY3NDA0NjA1NCwic3ViIjoiIiwic2NvcGVzIjpbImJhc2ljIl19.l7tYhOmtiUdOymWyWCiNCI8F4ZFIf9oG08C8V26eYCJ2XchVmuwWMSKPaVsRpqxXQwCXjkPWZQ4bQVJFFUCoyelseb8A7WBfBsXTrAHA_p_OBJa9vdPUA1ktmJQQDNzoZDrbNnxJvd8W0U5qCw5qjYG3kT1Kxfh3vgjCe1uxLT014bJBibT0akAFlXhaoBloPNOyUlzOVqKvKhvlpAFg0WVc29jddJbeZ0itze_5pcADMVu-ZIZw2DUEHW2P2eV_MSXY-vxJgdJ5cq45diSDh1PEFjwcv6D24tl0rZAEznIRdvo7n0mzHfa1kOHwpwTQRfyZb-B_3F2P6g61azoWKQ", //Mapir api key
        "Mapir-SDK": "reactjs",
      },
    };
  },
});

const Mapp = () => (
  <Mapir
    center={[51.42047, 35.729054]}
    Map={Map}
    containerStyle={{
      height: "100vh",
      width: "100vw",
    }}
    zoom={[10]}
  >
    <Mapir.Marker coordinates={[51.42047, 35.729054]} anchor="bottom" />
  </Mapir>
);

export default Mapp;
