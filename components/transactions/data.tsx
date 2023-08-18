import { CheckCircledIcon, StopwatchIcon } from "@radix-ui/react-icons";

export const labels = [
  {
    value: "true",
    label: "Sim",
  },
  {
    value: "false",
    label: "Não",
  },
];

export const statuses = [
  {
    value: "pending",
    label: "Pendente",
    icon: StopwatchIcon,
  },
  {
    value: "paid",
    label: "Pago",
    icon: CheckCircledIcon,
  },
];
