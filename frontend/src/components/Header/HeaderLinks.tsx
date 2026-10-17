// import { Link } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';

import OffsetLink from '../Handler/OffsetLink';

export default function NavigationMenuBeauty() {
  
  return (
    <NavigationMenu>
      <NavigationMenuList className="text-[#fff] text-lg space-x-8">
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

        {/* Shop */}
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <OffsetLink
              to="/shop"
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
      </NavigationMenuList>
    </NavigationMenu>
  );
}
