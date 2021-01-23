import { View } from "@adobe/react-spectrum";

type Props = {
  ratio: number;
  children: React.ReactNode;
};

export default function AspectRatio({ ratio = 1, children }: Props) {
  return (
    <View position="relative" width="100%" paddingBottom={`${100 / ratio}%`}>
      <View position="absolute" top={0} right={0} bottom={0} left={0}>
        {children}
      </View>
    </View>
  );
}
