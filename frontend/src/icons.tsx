import React from 'react';
import { FcCalendar as RawFcCalendar } from 'react-icons/fc';
import { FaPlusCircle as RawFaPlusCircle } from 'react-icons/fa';
import { CiSearch as RawCiSearch } from 'react-icons/ci';
import { TbError404 as RawTbError404 } from 'react-icons/tb';

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};

export const FcCalendar = RawFcCalendar as unknown as React.FC<IconProps>;
export const FaPlusCircle = RawFaPlusCircle as unknown as React.FC<IconProps>;
export const CiSearch = RawCiSearch as unknown as React.FC<IconProps>;
export const TbError404 = RawTbError404 as unknown as React.FC<IconProps>;
