import GradientBorder from "../../components/GradientBorder";

interface Props {
  question: string;
}

export default function SampleQuestion({ question }: Props) {
  return (
    <GradientBorder
      borderWidth={1}
      className="gradient-bg flex items-center rounded-full px-4 py-2"
    >
      <span className="text-[12px] leading-[16.4px] text-white backdrop-blur-3xl rounded-full">
        {question}
      </span>
    </GradientBorder>
  );
}
