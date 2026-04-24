import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-black group-[.toaster]:text-white group-[.toaster]:border-accent group-[.toaster]:shadow-[0_0_15px_rgba(255,0,0,0.2)] rounded-2xl p-4",
          description: "group-[.toast]:text-white/60",
          actionButton: "group-[.toast]:bg-accent group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-white/10 group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
