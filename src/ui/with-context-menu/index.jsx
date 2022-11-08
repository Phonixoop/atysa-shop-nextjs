import ContextMenu from "ui/context-menu";
export default function WithContextMenu(Component) {
  return function WrappedComponent({ children, ...rest }) {
    return (
      <>
        <Component {...rest} />
        <ContextMenu>{children}</ContextMenu>
      </>
    );
  };
}
