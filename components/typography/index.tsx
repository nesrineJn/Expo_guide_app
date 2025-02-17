import { customText, Text } from 'react-native-paper';
import { TextProps as RNPTextProps } from 'react-native-paper';
const ParagraphText = customText<'paragraph'>();
const SubTitleText = customText<'subTitle'>();
const TitleText = customText<'title'>();
const HintText = customText<'hint'>();
const LgText = customText<'lg'>();
const XlText = customText<'xl'>();
const LabelText = customText<'label'>();

export type TextPropsType = Omit<RNPTextProps<string>, 'variant'> & {};

const defaultProps: Omit<TextPropsType, 'children' | 'variant'> = {
  ellipsizeMode: 'tail',
};
function Paragraph(props: TextPropsType) {
  return <ParagraphText variant="paragraph" {...defaultProps} {...props} />;
}
function SubTitle(props: TextPropsType) {
  return <SubTitleText variant="subTitle" {...defaultProps} {...props} />;
}
function Title(props: TextPropsType) {
  return <TitleText variant="title" {...defaultProps} {...props} />;
}
function Hint(props: TextPropsType) {
  return <HintText variant="hint" {...defaultProps} {...props} />;
}
function Lg(props: TextPropsType) {
  return <LgText variant="lg" {...defaultProps} {...props} />;
}
function Xl(props: TextPropsType) {
  return <XlText variant="xl" {...defaultProps} {...props} />;
}
function Label(props: TextPropsType) {
  return <LabelText variant="label" {...defaultProps} {...props} />;
}
export default {
  Paragraph,
  SubTitle,
  Label,
  Title,
  Hint,
  Lg,
  Xl,
};
