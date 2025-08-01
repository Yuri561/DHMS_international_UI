// import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  // NavigationMenuTrigger,
  // NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { useAuth } from '../Context/AuthContext';
import OffsetLink from '../Handler/OffsetLink';

export default function NavigationMenuBeauty() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationMenu>
      <NavigationMenuList className="text-[#333333] text-lg space-x-8">
        {/* Home */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <OffsetLink
              to="/home"
              className="hover:bg-[#f3cb50] rounded-full px-3 py-1 transition"
            >
              Home
            </OffsetLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Categories Dropdown (opens upward) */}
        {/* <NavigationMenuItem className="relative"> */}
          {/* <NavigationMenuTrigger className="rounded-full px-3 py-1 bg-[#d5a86b] transition">
            Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent className="absolute bottom-full mb-2 bg-[#d5a86b] text-white rounded-lg shadow-md w-48">
            <ul className="grid gap-2 p-2">
              {[
                { to: '/shop', label: 'Handbag' },
                { to: '/shop', label: 'Men Shirts' },
                { to: '/shop', label: 'Women Dresses' },
                { to: '/shop', label: 'Body Products' },
              ].map(({ to, label }) => (
                <li key={label} className="rounded-full px-3 py-1 transition hover:bg-[#f3cb50]">
                  <NavigationMenuLink asChild>
                    <Link to={to} state={{ category: label }}>
                      {label}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}

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
              to="/contact"
              className="rounded-full px-3 py-1 hover:bg-[#f3cb50] transition"
            >
              Contact
            </OffsetLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Dashboard */}
        {isAuthenticated && (
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <OffsetLink
                to="/dashboard"
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
