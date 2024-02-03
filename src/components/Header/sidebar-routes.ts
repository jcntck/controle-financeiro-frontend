import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CategoryIcon from "@mui/icons-material/Category";
import DashboardIcon from "@mui/icons-material/Dashboard";

export type SidebarRouteItem = {
  title: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, "svg">>;
  path: string;
};

export class SidebarRouteItems {
  static get(): SidebarRouteItem[] {
    return [
      {
        title: "Dashboard",
        icon: DashboardIcon,
        path: "/",
      },
      {
        title: "Transações",
        icon: AccountBalanceWalletIcon,
        path: "/transactions",
      },
      {
        title: "Categorias",
        icon: CategoryIcon,
        path: "/categories",
      },
    ];
  }
}
