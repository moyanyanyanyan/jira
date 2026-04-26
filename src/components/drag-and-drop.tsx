// @ts-nocheck

import React, { PropsWithChildren, ReactNode } from "react";
import {
  Draggable,
  DraggableProps,
  Droppable,
  DroppableProps,
  DroppableProvided,
  DroppableProvidedProps,
} from "react-beautiful-dnd";

//二次封装拖拽组件
type DropProps = Omit<DroppableProps, "children"> & { children: ReactNode };
const DroppableComponent = Droppable as React.ComponentType<DroppableProps>;
export const Drop = ({ children, ...props }: DropProps) => {
  return (
    <DroppableComponent {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.droppableProps,
            ref: provided.innerRef,
            provided,
          });
        }
        return <div></div>;
      }}
    </DroppableComponent>
  );
};

type DropChildProps = Partial<
  { provided: DroppableProvided } & DroppableProvidedProps
> &
  React.HTMLAttributes<HTMLDivElement>;
export const DropChild = React.forwardRef<HTMLDivElement, DropChildProps>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
      {props.provided?.placeholder}
    </div>
  ),
);

type DragProps = Omit<DraggableProps, "children"> & { children: ReactNode };
const DraggableComponent = Draggable as React.ComponentType<DraggableProps>;
export const Drag = ({ children, ...props }: DragProps) => {
  return (
    <DraggableComponent {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.draggableProps,
            ...provided.dragHandleProps,
            ref: provided.innerRef,
          });
        }
        return <div></div>;
      }}
    </DraggableComponent>
  );
};
