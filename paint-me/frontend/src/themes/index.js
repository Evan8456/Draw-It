import { 
    extendTheme,
    theme as baseTheme, 
    withDefaultColorScheme
} from "@chakra-ui/react";

const overrides = {
    colors: {
        brand: baseTheme.colors.red
    },

    fonts: {
        RobotoSlab: 'RobotoSlab, sans-serif',
    }
};

export default extendTheme(overrides, withDefaultColorScheme({colorScheme: 'brand'}));