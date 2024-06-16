import { defineStyle, defineStyleConfig } from "@chakra-ui/styled-system"

const solid = defineStyle({
    borderWidth: "2px",
    borderStyle: "solid",
    borderRadius: 20,
    borderColor: "gray.300",
    _dark: {
      borderColor: "gray.700",
    }
})


export const dividerTheme = defineStyleConfig({
    variants: {
        "solid": solid
    },
})