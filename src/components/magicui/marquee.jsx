import { cn } from "../../lib/utils"; // Adjusted import path
import React from "react";
import PropTypes from 'prop-types'; // Added PropTypes import

// Simplified props for JS compatibility, focusing on what's used
// interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
//   className?: string;
//   reverse?: boolean;
//   pauseOnHover?: boolean;
//   children?: React.ReactNode;
//   vertical?: boolean;
//   repeat?: number;
//   [key: string]: any;
// }

const Marquee = React.forwardRef(
  (
    {
      className,
      reverse,
      pauseOnHover = false,
      children,
      vertical = false,
      repeat = 4, // Default repeat count from Magic UI docs
      isManuallyScrolling = false, // New prop
      ...props
    },
    ref, // This ref will be on the outer container with overflow:hidden
  ) => {
    return (
      <div
        ref={ref} // Outer container gets the ref and overflow:hidden
        className={cn(
          "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem]", // Removed [gap:var(--gap)] here
          {
            "flex-row": !vertical, // Ensures children layout correctly if Marquee is flex container itself
            "flex-col": vertical,
          },
          className,
        )}
        {...props}
      >
        {/* Inner scrolling container that will actually animate and be wider/taller than parent */}
        <div
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)]", // [gap:var(--gap)] moved here
            {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover && !isManuallyScrolling,
              "[animation-play-state:paused]": isManuallyScrolling,
              "[animation-direction:reverse]": reverse,
            },
          )}
        >
          {Array(repeat)
            .fill(0)
            .map((_, i) => (
              // Each repeated block of children
              <div
                key={i}
                // Removed animation classes from here, they are on the parent scrolling div now
                className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
                    "flex-row": !vertical,
                    "flex-col": vertical,
                })}
              >
                {children}
              </div>
            ))}
        </div>
      </div>
    );
  },
);

Marquee.propTypes = {
  className: PropTypes.string,
  reverse: PropTypes.bool,
  pauseOnHover: PropTypes.bool,
  children: PropTypes.node,
  vertical: PropTypes.bool,
  repeat: PropTypes.number,
  isManuallyScrolling: PropTypes.bool,
};

Marquee.displayName = "Marquee";

export default Marquee; 