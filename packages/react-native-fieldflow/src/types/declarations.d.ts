declare module '@react-native-community/datetimepicker' {
  import { ComponentType } from 'react';
  const DateTimePicker: ComponentType<any>;
  export default DateTimePicker;
}

declare module '@expo/vector-icons' {
  import { ComponentType } from 'react';
  export const Ionicons: ComponentType<any>;
  export const MaterialCommunityIcons: ComponentType<any>;
  export const Entypo: ComponentType<any>;
  export const Feather: ComponentType<any>;
  export const FontAwesome: ComponentType<any>;
  export const AntDesign: ComponentType<any>;
}

declare module 'react-native-fieldflow' {
  export * from '../index';
}
