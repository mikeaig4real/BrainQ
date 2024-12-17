"use client";
import React from "react";
import NavBarComponent from "@/components/Navbar";
import { usePathname, useRouter } from "next/navigation";
import {
  Authenticator,
  ThemeProvider,
  Theme,
  useTheme,
  View,
} from "@aws-amplify/ui-react";
import { useGame } from "@/contexts/GameContext";

const MenuLayout = ({ children }: { children: React.ReactNode }) => {
  const { tokens } = useTheme();
  const pathName = usePathname();
  const { user, signOut } = useGame();
  interface NavProps {
    avatar: {
      text: string | undefined;
      alt: string | undefined;
    };
    navItems: Array<{
      type: string;
      label: string;
      onClick?: () => void;
      href?: string;
    }>;
  }
  const getPropsForNav = (path: string): NavProps | undefined => {
    const avatar = {
      text: user?.signInDetails?.loginId,
      alt: user?.signInDetails?.loginId,
    };

    const logOutBtn = {
      type: "button",
      label: "LogOut",
      onClick: () => {
        signOut();
      },
    };

    const backToMenu = {
      type: "link",
      href: "/menu",
      label: "Menu",
    };

    const pathPropsMap: Record<string, NavProps> = {
      "/menu": {
        avatar,
        navItems: [logOutBtn],
      },
    };

    return (
      pathPropsMap[path] || {
        avatar,
        navItems: [backToMenu, logOutBtn],
      }
    );
  };
  const theme: Theme = {
    name: "Auth Example Theme",
    tokens: {
      components: {
        input: {
          color: { value: "{colors.black}" },
        },
        authenticator: {
          router: {
            boxShadow: `0 0 16px ${tokens.colors.overlay["10"]}`,
            borderWidth: "0",
          },
          form: {
            padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
          },
        },
        button: {
          backgroundColor: "#000000",
          color: tokens.colors.white,
          primary: {
            backgroundColor: tokens.colors.neutral["100"],
          },
          link: {
            color: tokens.colors.black,
          },
        },
        fieldcontrol: {
          color: tokens.colors.black,
          _focus: {
            boxShadow: `0 0 0 2px ${tokens.colors.black}`,
          },
        },
        tabs: {
          item: {
            color: tokens.colors.neutral["80"],
            _active: {
              borderColor: tokens.colors.neutral["100"],
              color: tokens.colors.purple["100"],
            },
          },
        },
      },
    },
  };
  return (
    <ThemeProvider theme={theme}>
      <View padding="xxl">
        <Authenticator>
          <section className="min-h-screen w-[80vw] flex flex-col py-14 px-6">
            <NavBarComponent {...getPropsForNav(pathName)} showAvatar={true} />
            <div className="flex-1 flex items-center justify-center">
              {children}
            </div>
          </section>
        </Authenticator>
      </View>
    </ThemeProvider>
  );
};

export default MenuLayout;
