import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "amplifyAlpHDmeshes",
  access: (allow) => ({
    "meshes/*": [
      allow.guest.to(["read"]),
    ],

  }),
});
