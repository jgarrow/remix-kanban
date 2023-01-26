export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, ...rest }: ButtonProps) {
  return (
    <button
      className="flex justify-center items-center border-none cursor-pointer hover:scale-125 transition 200 ease"
      {...rest}
    >
      {children}
    </button>
  );
}
