import React from "react";
import { View, Text, Pressable } from "react-native";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import {
  ArrowIcon,
  CameraIcon,
  ForkKnifeIcon,
  PlaneIcon,
} from "@/components/icons";
import { user } from "@/utils/userService";
import { StrataButton } from "@/components/strata-button/StrataButton";

type BudgetProps = {
  trip: any;
};

const budgetTypes: any = [
  {
    icon: <ForkKnifeIcon color={Colors.grey600} classname={styles.iconSm} />,
    title: "Food",
  },
  {
    icon: (
      <PlaneIcon
        color={Colors.grey600}
        classname={[styles.iconSm, { width: 22 }]}
      />
    ),
    title: "Transports",
    minusGap: true,
  },
  {
    icon: <CameraIcon color={Colors.grey600} classname={styles.iconSm} />,
    title: "Activities",
  },
];

export function BudgetScreen(props: BudgetProps) {
  const getPersonalBudget = () => {
    if (!props.trip?.members || props.trip.members.length === 0) {
      return "TBD";
    }

    const currentMember = props.trip.members.find(
      (member: any) => member.user_id === user.user_id,
    );

    return currentMember?.personal_budget || "TBD";
  };

  const getTotalSpent = () => {
    if (!props.trip?.expenses || props.trip.expenses.length === 0) {
      return 0;
    }

    return props.trip.expenses.reduce((total: number, expense: any) => {
      if (expense.user_id === user.user_id) {
        return total + Number(expense.amount);
      }

      return total;
    }, 0);
  };

  const getTotalPercentageFromLimit = () => {
    if (!props.trip?.expenses || props.trip.expenses.length === 0) {
      return 0;
    }

    if (getPersonalBudget() === "TBD") {
      return 100;
    }

    return Math.round((getTotalSpent() * 100) / Number(getPersonalBudget()));
  };

  const getExpenseTypeTotal = (expenseType: string) => {
    if (!props.trip?.expenses || props.trip.expenses.length === 0) {
      return 0;
    }

    return props.trip.expenses.reduce((total: number, expense: any) => {
      if (expense.user_id === user.user_id && expense.type === expenseType) {
        return total + Number(expense.amount);
      }

      return total;
    }, 0);
  };

  const getExpenseTypePercentageFromTotalSpent = (expenseType: string) => {
    if (!props.trip?.expenses || props.trip.expenses.length === 0) {
      return 0;
    }

    // const totalSpent = getTotalSpent();
    // const expenseTypeTotal = getExpenseTypeTotal(expenseType);

    return Math.round(
      (getExpenseTypeTotal(expenseType) * 100) / getTotalSpent(),
    );
  };

  return (
    <>
      <View style={styles.card}>
        <View style={[styles.container, styles.top]}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.label}>SPENT</Text>

            <Text style={styles.title}>{getTotalSpent()}€</Text>
          </View>

          <Pressable style={styles.bgIcon} onPress={() => {}}>
            <ArrowIcon
              color={Colors.primaryDark}
              classname={[styles.icon, { transform: [{ rotate: "180deg" }] }]}
            />
          </Pressable>
        </View>

        <View style={styles.container}>
          {budgetTypes.map((budgetType: any) => (
            <View
              key={budgetType.title}
              style={[
                styles.budgetContainer,
                budgetType.minusGap && { gap: 12 },
              ]}
            >
              {budgetType.icon}

              <View style={styles.progressContainer}>
                <Text style={styles.label}>{budgetType.title}</Text>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: `${getExpenseTypePercentageFromTotalSpent(
                          budgetType.title,
                        )}%`,
                      },
                    ]}
                  ></View>
                </View>
              </View>

              <View
                style={[
                  styles.budgetText,
                  budgetType.minusGap && { paddingLeft: 4 },
                ]}
              >
                <Text style={styles.text}>
                  {getExpenseTypeTotal(budgetType.title)}€
                </Text>

                <Text style={[styles.label, { color: Colors.grey400 }]}>
                  {getExpenseTypePercentageFromTotalSpent(budgetType.title)}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.container, styles.bottom]}>
          <View style={styles.textContainer}>
            <Text style={styles.label}>Spent</Text>
            <Text style={styles.label}>Limit</Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.bar,
                {
                  width: `${getTotalPercentageFromLimit()}%`,
                },
              ]}
            ></View>
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.text}>{getTotalSpent()}€</Text>

            <Text style={[styles.label, { color: Colors.grey400 }]}>
              {getTotalPercentageFromLimit()}%
            </Text>

            <Text style={styles.text}>
              {getPersonalBudget() === "TBD"
                ? getPersonalBudget()
                : `${getPersonalBudget()}€`}
            </Text>
          </View>
        </View>
      </View>
      <StrataButton
        title="Add expense"
        text="Track your spending!"
        imageSource={require("@/assets/images/bill.png")}
        onPress={() => { }}
      />
      ,
    </>
  );
}
