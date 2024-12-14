import React, { forwardRef, useState, Fragment } from "react";
import { twMerge } from "tailwind-merge";
import { Transition } from "@headlessui/react";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "pending"
  | "danger"
  | "dark"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-warning"
  | "outline-pending"
  | "outline-danger"
  | "outline-dark"
  | "soft-primary"
  | "soft-secondary"
  | "soft-success"
  | "soft-warning"
  | "soft-pending"
  | "soft-danger"
  | "soft-dark";

type AlertProps<C extends React.ElementType> = {
  as?: C;
  children?:
    | React.ReactNode
    | ((props: { dismiss: () => void }) => React.ReactNode);
  dismissible?: boolean;
  variant?: Variant;
  onShow?: () => void;
  onShown?: () => void;
  onHide?: () => void;
  onHidden?: () => void;
  className?: string;
} & React.ComponentPropsWithoutRef<C>;

type AlertComponent = <C extends React.ElementType = "div">(
  props: AlertProps<C>
) => React.ReactElement | null;

const Alert: AlertComponent = forwardRef(function Alert<C extends React.ElementType>(
  { as, dismissible, variant, children, ...props }: AlertProps<C>,
  ref: React.Ref<any>
) {
  const [show, setShow] = useState<boolean>(true);
  const Component = as || "div";

  // Define styles for each variant
  const styles = {
    primary: "bg-primary text-white",
    secondary: "bg-secondary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-white",
    pending: "bg-pending text-white",
    danger: "bg-danger text-white",
    dark: "bg-dark text-white",
    "outline-primary": "border border-primary text-primary",
    "outline-secondary": "border border-secondary text-secondary",
    "outline-success": "border border-success text-success",
    "outline-warning": "border border-warning text-warning",
    "outline-pending": "border border-pending text-pending",
    "outline-danger": "border border-danger text-danger",
    "outline-dark": "border border-dark text-dark",
    "soft-primary": "bg-primary/10 text-primary",
    "soft-secondary": "bg-secondary/10 text-secondary",
    "soft-success": "bg-success/10 text-success",
    "soft-warning": "bg-warning/10 text-warning",
    "soft-pending": "bg-pending/10 text-pending",
    "soft-danger": "bg-danger/10 text-danger",
    "soft-dark": "bg-dark/10 text-dark",
  };

  return (
    <Transition
      as={Fragment}
      show={show}
      enter="transition-all ease-linear duration-150"
      enterFrom="invisible opacity-0 translate-y-1"
      enterTo="visible opacity-100 translate-y-0"
      leave="transition-all ease-linear duration-150"
      leaveFrom="visible opacity-100 translate-y-0"
      leaveTo="invisible opacity-0 translate-y-1"
    >
      <Component
        {...props}
        ref={ref}
        role="alert"
        className={twMerge(
          "relative border rounded-md px-5 py-4",
          variant && styles[variant],
          dismissible && "pl-5 pr-16",
          props.className
        )}
      >
        {typeof children === "function"
          ? children({ dismiss: () => setShow(false) })
          : children}

        {dismissible && (
          <button
            type="button"
            className="absolute top-1/2 right-4 -translate-y-1/2 text-lg"
            onClick={() => setShow(false)}
            aria-label="Close"
          >
            ×
          </button>
        )}
      </Component>
    </Transition>
  );
}) as AlertComponent;

export default Alert;
