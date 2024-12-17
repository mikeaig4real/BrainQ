import React from "react";
import Link from "next/link";


type NavItem = {
  type: string;
  href?: any;
  onClick?: () => void;
  label?: string;
  badge?: string;
};

interface AvatarProps {
  src?: string;
  alt?: string;
  text?: string;
  className?: string;
}

interface NavBarProps {
  brand?: {
    text: string;
    className?: string;
    href?: string;
  };
  showAvatar?: boolean;
  showBrand?: boolean;
  avatar?: AvatarProps;
  navItems?: NavItem[];
  className?: string;
  [key: string]: any; // For rest props
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  text,
  className,
  ...rest
}) => {
  const getInitials = (text: string) => {
    const initials = text
      .split(/[ -]/)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
    return initials.length < 2 ? text.slice(0, 2).toUpperCase() : initials;
  };

  return (
    <div className={`w-10 rounded-full ${className || ""}`} {...rest}>
      {src ? (
        <img alt={alt || "Avatar"} src={src} className="rounded-full" />
      ) : (
        <div className="w-full h-full rounded-full bg-primary flex items-center justify-center text-primary-content">
          {text ? getInitials(text) : "N/A"}
        </div>
      )}
    </div>
  );
};

const NavBarComponent: React.FC<NavBarProps> = ({
  brand = { text: "Brain-Q" },
  showAvatar = true,
  showBrand = true,
  avatar,
  navItems = [],
  className = "",
  ...rest
} ) =>
{
  return (
    <div className={`navbar bg-black rounded-full ${className}`} {...rest}>
      {showBrand && (
        <div className="flex-1">
          <Link
            href={brand?.href || "/"}
            className={`btn btn-ghost text-xl ${brand.className || ""}`}
          >
            {brand.text}
          </Link>
        </div>
      )}
      <div className="flex-none gap-2">
        {showAvatar && (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <Avatar {...avatar} />
            </div>
            {!!navItems?.length && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                {navItems.map((item, index) => (
                  <li key={index}>
                    {item.type === "link" ? (
                      <Link href={item.href}>
                        <span className="justify-between">
                          {item.label}
                          {item.badge && (
                            <span className="badge">{item.badge}</span>
                          )}
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={item.onClick || (() => {})}
                        className="justify-between"
                      >
                        {item.label}
                        {item.badge && (
                          <span className="badge">{item.badge}</span>
                        )}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBarComponent;
