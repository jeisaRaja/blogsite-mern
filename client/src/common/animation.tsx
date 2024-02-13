import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimationWrapperProps {
  children: ReactNode;
  initial?: Record<string, null>;
  animate?: Record<string, null>;
  transition?: CSSTransition;
  keyValue?: string;
  className?: string;
}

const AnimationWrapper: React.FC<AnimationWrapperProps>  = ({
  children,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: 1 },
  keyValue,
  className,
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={initial}
        animate={animate}
        transition={transition}
        key={keyValue}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimationWrapper;
