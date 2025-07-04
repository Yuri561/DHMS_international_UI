import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { useAuth } from '../Context/AuthContext';
import OffsetLink from '../Handler/OffsetLink';
// import { useState } from 'react';


export default function NavigationMenuBeauty() {
  const { isAuthenticated } = useAuth();
  function handleClick(_event: any): void {
    throw new Error('Function not implemented.');
  }

  //  const [loadingAnimation, setLoadingAnimation] = useState<boolean>(false);

  return (
    <NavigationMenu>

      <NavigationMenuList className="text-white text-xs">

        {/* Home */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <OffsetLink
              to="/home#top"
              className="hover:bg-[#f3cb50] rounded-full px-3 py-1 transition"
            >
              Home
            </OffsetLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Categories Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="rounded-full px-3 py-1 bg-[#d5a86b] transition">
            Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent className=" bg-[#d5a86b] text-white">
            <ul className="grid gap-2 p-2 w-48">
              {[
                { to: '/shop#top', label: 'Handbag' },
                { to: '/shop#top', label: 'Men Shirts' },
                { to: '/shop#top', label: 'Women Dresses' },
                { to: '/shop#top', label: 'Body Products' },
              ].map(({ to, label }) => (
                <li
                  key={label}
                  className="rounded-full px-3 py-1  transition"
                >
                  <NavigationMenuLink asChild>
                    <Link to={to}  state={{ category: label }}>
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Shop */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <OffsetLink
              to="/shop#top"
              className="rounded-full px-3 py-1 hover:bg-[#f3cb50] transition"
            >
              Shop
            </OffsetLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Contact */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <OffsetLink
              to="/contact#top"
              onClick={handleClick}
              className="rounded-full px-3 py-1 hover:bg-[#f3cb50] transition"
            >
              Contact
            </OffsetLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Dashboard (if authenticated) */}
        {isAuthenticated && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <OffsetLink
                to="/dashboard#top"
                onClick={handleClick}
                className="rounded-full px-3 py-1 hover:bg-[#f3cb50] transition"
              >
                Dashboard
              </OffsetLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        )}

      </NavigationMenuList>
    </NavigationMenu>
  );
}
