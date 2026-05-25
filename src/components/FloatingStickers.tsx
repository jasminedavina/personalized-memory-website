type FloatingStickersProps = {
  className?: string;
};

export function FloatingStickers({ className }: FloatingStickersProps) {
  return (
    <div className={`floating-stickers ${className ?? ""}`}>
      <span className="sticker sticker-1" />
      <span className="sticker sticker-2" />
      <span className="sticker sticker-3" />
    </div>
  );
}
