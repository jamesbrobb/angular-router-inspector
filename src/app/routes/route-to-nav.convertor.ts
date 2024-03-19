import {NavItemNode} from "@jamesbenrobb/ui";
import {RouteConfig} from "./route.helpers";


export function convertRoutes(arg: RouteConfig[], parentPath: string = '') {
  return arg
    .map(route => createMenuItem(route, parentPath));
}

function createMenuItem(route: RouteConfig, parentPath: string): NavItemNode {
  const path = `${parentPath}/${(route.path || 'no-path')}`,
    parts = path.split('/'),
    label = parts[parts.length - 1].replaceAll('-', ' ');

  const node: NavItemNode = {
    path,
    label,
    active: 0,
    hasContent: true
  }

  if(route.children && route.children.length > 0) {
    node.children = convertRoutes(route.children, path);
  }

  return node;
}
