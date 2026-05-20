import Proximate from "@/components/variable-proximity/Proximate";

export default function BlogTagList({ tags }: { tags: string[] }) {
  if (!tags.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-black bg-pink-primary px-3 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-black"
        >
          <Proximate>{tag}</Proximate>
        </li>
      ))}
    </ul>
  );
}
