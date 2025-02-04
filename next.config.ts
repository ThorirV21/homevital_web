
import { withGluestackUI } from "@gluestack/ui-next-adapter";

const nextConfig = {
  transpilePackages: ["nativewind", "react-native-css-interop"],
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: true,
      },
    ]
  }
};

export default withGluestackUI(nextConfig);
