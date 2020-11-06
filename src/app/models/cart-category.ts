import { MenuElement } from "./menu-element";
export interface CartCategory {
  id: number;
  name: string;
  alias: string;
  bgColor?: string
  isSpecial?: boolean
  ordering: number;
  toPlus: boolean;
  elements?: MenuElement[];
}
