import {
  LinkHorizontal,
  LinkVertical,
} from '@visx/shape';

export default function getLinkComponent({
  orientation,
}: {
  layout: string;
  linkType: string;
  orientation: string;
}): React.ComponentType<any> {
  let LinkComponent: React.ComponentType<any>;

  if (orientation === 'vertical') {
    LinkComponent = LinkVertical;
  } else {
    LinkComponent = LinkHorizontal;
  }
  return LinkComponent;
}