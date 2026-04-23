import {
  BackpackIcon,
  BillIcon,
  CoinIcon,
  CreditCardIcon,
  FarmIcon,
  GlobeIcon,
  HikeIcon,
  LockIcon,
  MountainsIcon,
  RunIcon,
  TreePalmIcon,
  UsersIcon,
  WalkIcon,
} from "@/components/icons";

export const visibilityOptions = [
  {
    id: "private",
    label: "Private",
    icon: <LockIcon />,
  },
  {
    id: "public",
    label: "Public",
    icon: <GlobeIcon />,
  },
  {
    id: "friends",
    label: "Friends only",
    icon: <UsersIcon />,
  },
];

export const budgetOptions = [
  {
    id: "low",
    label: "Low",
    subLabel: "Budget",
    icon: <CoinIcon />,
  },
  {
    id: "mid",
    label: "Mid",
    subLabel: "Budget",
    icon: <BillIcon />,
  },
  {
    id: "high",
    label: "High",
    subLabel: "Budget",
    icon: <CreditCardIcon />,
  },
];

export const intensityOptions = [
  {
    id: "low",
    label: "Low",
    subLabel: "Intensity",
    icon: <WalkIcon />,
  },
  {
    id: "mid",
    label: "Mid",
    subLabel: "Intensity",
    icon: <HikeIcon />,
  },
  {
    id: "high",
    label: "High",
    subLabel: "Intensity",
    icon: <RunIcon />,
  },
];

export const styleOptions = [
  {
    id: "backpacker",
    label: "Backpacker",
    subLabel: "Style",
    icon: <BackpackIcon />,
  },
  {
    id: "adventure",
    label: "Adventure",
    subLabel: "Style",
    icon: <MountainsIcon />,
  },
  {
    id: "cultural",
    label: "Cultural",
    subLabel: "Style",
    icon: <FarmIcon />,
  },
  {
    id: "resort",
    label: "Resort",
    subLabel: "Style",
    icon: <TreePalmIcon />,
  },
];