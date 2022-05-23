import {
  extendTheme,
  theme as base,
  withDefaultColorScheme,
} from "@chakra-ui/react";

const inputStyles = {
  variants: {
    outline: {
      field: {
        color: "#f0f0f0",
        borderColor: "raid.800",
        borderWidth: "2px",
        background: "#343a40",
        _focus: {
          borderColor: "raid.50",
          boxShadow: "raid.50",
        },
        _hover: {
          borderColor: "raid.50",
          boxShadow: "raid.50",
        },
        ">option": {
          background: "inherit",
          color: "#f0f0f0",
        },
      },
    },
  },
  sizes: {
    md: {
      field: {
        borderRadius: "2px",
      },
    },
  },
};

const theme = extendTheme(
  {
    global: {
      body: {
        background: "raid.50",
      },
    },
    colors: {
      raid: {
        50: "#FF3864",
        100: "#E6375E",
        200: "#CC3758",
        300: "#B33652",
        400: "#99364C",
        500: "#803545", //
        600: "#66343F",
        700: "#4D3439",
        800: "#333333",
      },
      secondary: {
        50: "#E5E5E5",
        100: "#333",
      },
    },
    fonts: {
      heading: `Inter ${base.fonts?.heading}`,
      body: `Inter ${base.fonts?.body}`,
    },
    components: {
      Input: { ...inputStyles },
      Select: { ...inputStyles },
    },
  },
  withDefaultColorScheme({
    colorScheme: "raid",
    components: ["Input", "Button", "Select"],
  })
  // withDefaultVariant({
  // 	variant: 'outline',
  // 	components: ['Input', 'Select']
  // })
);

export default theme;
