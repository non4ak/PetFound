import React, { type ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { cn } from "@/utils";

interface AppScreenScaffoldProps {
  children: ReactNode;
  contentClassName?: string;
  footer?: ReactNode;
  header: ReactNode;
  scrollContentClassName?: string;
}

export function AppScreenScaffold({
  children,
  contentClassName,
  footer,
  header,
  scrollContentClassName,
}: AppScreenScaffoldProps) {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className={cn("flex-1 px-4 py-4", contentClassName)}>
        {header}

        <ScrollView
          className="mt-6 flex-1"
          contentContainerClassName={cn("pb-6", scrollContentClassName)}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        {footer ? <View className="pt-4">{footer}</View> : null}
      </View>
    </SafeAreaView>
  );
}
