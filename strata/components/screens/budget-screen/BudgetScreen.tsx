import React, { useCallback, useState } from "react";
import { View, Text, Pressable } from "react-native";
import * as Crypto from "expo-crypto";
import { styles } from "./styles";
import { Colors, Typography } from "@/constants/global-styles";
import {
  ArrowIcon,
  CameraIcon,
  ForkKnifeIcon,
  PlaneIcon,
} from "@/components/icons";
import { user } from "@/utils/userService";
import { StrataButton } from "@/components/strata-button/StrataButton";
import { StrataModal } from "@/components/strata-modal/StrataModal";
import { StrataCTA } from "@/components/strata-cta/StrataCTA";
import { floatInputProperties } from "@/utils/input-properties";
import { StrataInput } from "@/components/strata-input/StrataInput";
import { StrataRadioButtonGroup } from "@/components/strata-radio-button-group/StrataRadioButtonGroup";
import { pushChanges } from "@/utils/StrataApiService";
import { useFocusEffect } from "expo-router";

type BudgetProps = {
  trip: any;
  setTrip: any;
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

const radioButtons = [
  {
    id: "Transports",
    label: "Transports",
    icon: (
      <PlaneIcon
        color={Colors.grey400}
        classname={[styles.iconSm, { width: 22 }]}
      />
    ),
  },
  {
    id: "Food",
    label: "Food",
    icon: <ForkKnifeIcon color={Colors.grey400} classname={styles.iconSm} />,
  },
  {
    id: "Activities",
    label: "Activities",
    icon: <CameraIcon color={Colors.grey400} classname={styles.iconSm} />,
  },
];

export function BudgetScreen(props: BudgetProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [isPending, setisPending] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<string | number>("Transports");

  useFocusEffect(
    useCallback(() => {
      return async () => {
        setisPending(false);
        setAmount("");
        setType("Transports");
      };
    }, []),
  );

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

      return Number(total).toFixed(2);
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

  const AddExpense = async () => {
    const expense = {
      expense_id: Crypto.randomUUID(),
      trip_id: props.trip.trip_id,
      user_id: user.user_id,
      type: type.toString(),
      amount: Math.trunc(Number(amount) * 100) / 100,
    };

    try {
      setisPending(true);

      await pushChanges({
        expenses: {
          created: [expense],
          updated: [],
          deleted: [],
        },
      });
    } catch (error) {
      console.error("Error while Adding expense:", error);
    } finally {
      props.setTrip({
        ...props.trip,
        expenses: [...props.trip.expenses, expense],
      });

      setisPending(false);
      setAmount("");
      setType("Transports");
      setModalVisible(false);
    }
  };

  return (
    <>
      <View style={styles.card}>
        <View style={[styles.container, styles.top]}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.label}>SPENT</Text>

            <Text style={styles.title}>
              {Number(getTotalSpent()).toFixed(2)}€
            </Text>
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
                  {Number(getExpenseTypeTotal(budgetType.title).toFixed(2))}€
                </Text>

                <Text style={[styles.label, { color: Colors.grey400 }]}>
                  {Number(
                    getExpenseTypePercentageFromTotalSpent(
                      budgetType.title,
                    ).toFixed(0),
                  )}
                  %
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
            <Text style={styles.text}>
              {Number(getTotalSpent().toFixed(2))}€
            </Text>

            <Text style={[styles.label, { color: Colors.grey400 }]}>
              {Number(getTotalPercentageFromLimit().toFixed(0))}%
            </Text>

            <Text style={styles.text}>
              {getPersonalBudget() === "TBD"
                ? getPersonalBudget()
                : `${Number(getPersonalBudget()).toFixed(2)}€`}
            </Text>
          </View>
        </View>
      </View>
      <StrataButton
        title="Add expense"
        text="Track your spending!"
        imageSource={require("@/assets/images/bill.png")}
        onPress={() => setModalVisible(true)}
      />

      <StrataModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <>
          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: Colors.grey400 }]}>
              Amount spent
            </Text>

            <StrataInput
              properties={{
                ...floatInputProperties,
                value: amount,
                onChangeText: setAmount,
              }}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={[styles.label, { color: Colors.grey400 }]}>
              Expense type
            </Text>

            <StrataRadioButtonGroup
              options={radioButtons}
              selectedValue={type}
              onValueChange={setType}
            />
          </View>

          <StrataCTA
            text="Add Expense"
            isDisabled={amount.length <= 0 || isPending}
            classname={[
              { marginTop: 24 },
              (amount.length <= 0 || isPending) && {
                backgroundColor: Colors.grey100,
                borderColor: Colors.grey200,
              },
            ]}
            textclassname={[
              { ...Typography.cta },
              (amount.length <= 0 || isPending) && { color: Colors.grey400 },
            ]}
            onPress={() => AddExpense()}
          />
        </>
      </StrataModal>
    </>
  );
}
