import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import { FeedCard } from "@/components/announcement/FeedCard";
import { Typography } from "@/components/ui/Typography";
import { useGetAnnouncements } from "@/data/hooks/announcements";
import type { Announcement, AnnouncementQueryFilter } from "@/types/announcement";

const PAGE_SIZE = 10;

type StatusFilter = "all" | "lost" | "found";
type PetTypeFilter = "all" | "dog" | "cat";

const STATUS_OPTIONS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Lost", value: "lost" },
  { label: "Found", value: "found" },
];

const PET_TYPE_OPTIONS: { label: string; value: PetTypeFilter }[] = [
  { label: "All", value: "all" },
  { label: "Dog", value: "dog" },
  { label: "Cat", value: "cat" },
];

const STATUS_MAP: Record<StatusFilter, number | undefined> = {
  all: undefined,
  lost: 0,
  found: 1,
};

const PET_TYPE_MAP: Record<PetTypeFilter, number | undefined> = {
  all: undefined,
  dog: 0,
  cat: 1,
};

export default function HomeScreen() {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [petTypeFilter, setPetTypeFilter] = useState<PetTypeFilter>("all");
  const [pageNumber, setPageNumber] = useState(0);
  const [allItems, setAllItems] = useState<Announcement[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchText.trim());
    }, 400);
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchText]);

  useEffect(() => {
    setPageNumber(0);
    setAllItems([]);
  }, [debouncedSearch]);

  const query: AnnouncementQueryFilter = {
    pageNumber,
    pageSize: PAGE_SIZE,
    sortBy: "createdOn",
    sortDirection: "desc",
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(STATUS_MAP[statusFilter] !== undefined ? { petStatus: STATUS_MAP[statusFilter] } : {}),
    ...(PET_TYPE_MAP[petTypeFilter] !== undefined ? { petType: PET_TYPE_MAP[petTypeFilter] } : {}),
  };

  const { data, isFetching, isError } = useGetAnnouncements(query);

  useEffect(() => {
    if (!data) return;
    if (pageNumber === 0) {
      setAllItems(data.items ?? []);
    } else {
      setAllItems((prev) => [...prev, ...(data.items ?? [])]);
    }
    setIsFetchingMore(false);
  }, [data, pageNumber]);

  const handleFilterChange = useCallback(
    (newStatus: StatusFilter, newPetType: PetTypeFilter) => {
      setStatusFilter(newStatus);
      setPetTypeFilter(newPetType);
      setPageNumber(0);
      setAllItems([]);
    },
    [],
  );

  const handleRemoveStatus = () => handleFilterChange("all", petTypeFilter);
  const handleRemovePetType = () => handleFilterChange(statusFilter, "all");

  const handleLoadMore = () => {
    if (isFetching || isFetchingMore) return;
    if (!data) return;
    if (pageNumber >= data.totalPages - 1) return;
    setIsFetchingMore(true);
    setPageNumber((p) => p + 1);
  };

  const activeFilterCount =
    (statusFilter !== "all" ? 1 : 0) + (petTypeFilter !== "all" ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-4 pt-4">
        <Typography variant="title-large" className="mb-4">
          Pet Announcements
        </Typography>

        {/* Search + Filter button */}
        <View className="mb-3 flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center rounded-[12px] border border-[#E6EAF0] bg-white px-3 py-2">
            <Ionicons name="search-outline" size={18} color="#8D8D8D" />
            <TextInput
              className="ml-2 flex-1 text-[16px] text-heading-text"
              placeholder="Search announcements..."
              placeholderTextColor="#8D8D8D"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons name="close-circle" size={18} color="#8D8D8D" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            onPress={() => setShowFilters((v) => !v)}
            className="flex-row items-center gap-1 rounded-[12px] bg-primary px-4 py-2.5"
            activeOpacity={0.8}
          >
            <Typography variant="body-small" className="font-semibold text-heading-text text-[15px]">
              Filters
            </Typography>
            {activeFilterCount > 0 && (
              <View className="ml-1 h-5 w-5 items-center justify-center rounded-full bg-heading-text">
                <Typography variant="body-small" className="text-[11px] font-bold text-white">
                  {activeFilterCount}
                </Typography>
              </View>
            )}
            <Ionicons
              name={showFilters ? "chevron-up" : "chevron-down"}
              size={14}
              color="#0F172A"
            />
          </TouchableOpacity>
        </View>

        {/* Inline filter panel */}
        {showFilters && (
          <View className="mb-3 rounded-[14px] border border-[#E6EAF0] bg-white p-4 gap-3">
            <View>
              <Typography variant="body-small" className="mb-2 font-semibold text-heading-text">
                Status
              </Typography>
              <View className="flex-row gap-2">
                {STATUS_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => handleFilterChange(opt.value, petTypeFilter)}
                    className={`rounded-full px-4 py-1.5 border ${
                      statusFilter === opt.value
                        ? "border-primary bg-primary"
                        : "border-[#E6EAF0] bg-white"
                    }`}
                  >
                    <Typography
                      variant="body-small"
                      className={`text-[14px] font-medium ${
                        statusFilter === opt.value ? "text-heading-text" : "text-secondary-text"
                      }`}
                    >
                      {opt.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View>
              <Typography variant="body-small" className="mb-2 font-semibold text-heading-text">
                Pet type
              </Typography>
              <View className="flex-row gap-2">
                {PET_TYPE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => handleFilterChange(statusFilter, opt.value)}
                    className={`rounded-full px-4 py-1.5 border ${
                      petTypeFilter === opt.value
                        ? "border-primary bg-primary"
                        : "border-[#E6EAF0] bg-white"
                    }`}
                  >
                    <Typography
                      variant="body-small"
                      className={`text-[14px] font-medium ${
                        petTypeFilter === opt.value ? "text-heading-text" : "text-secondary-text"
                      }`}
                    >
                      {opt.label}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Active filter chips */}
        {hasActiveFilters && (
          <View className="mb-3 flex-row flex-wrap gap-2">
            {statusFilter !== "all" && (
              <TouchableOpacity
                onPress={handleRemoveStatus}
                className="flex-row items-center gap-1 rounded-full bg-[#FFDCE1] px-3 py-1"
              >
                <Typography variant="body-small" className="text-[13px] font-semibold text-[#D95068]">
                  {STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label}
                </Typography>
                <Ionicons name="close" size={13} color="#D95068" />
              </TouchableOpacity>
            )}
            {petTypeFilter !== "all" && (
              <TouchableOpacity
                onPress={handleRemovePetType}
                className="flex-row items-center gap-1 rounded-full bg-[#EEF4FB] px-3 py-1"
              >
                <Typography variant="body-small" className="text-[13px] font-semibold text-[#1E5FA8]">
                  {PET_TYPE_OPTIONS.find((o) => o.value === petTypeFilter)?.label}
                </Typography>
                <Ionicons name="close" size={13} color="#1E5FA8" />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Feed list */}
        {isFetching && pageNumber === 0 && allItems.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#F2C94C" />
          </View>
        ) : isError ? (
          <View className="flex-1 items-center justify-center gap-2">
            <Ionicons name="alert-circle-outline" size={48} color="#D95068" />
            <Typography variant="body-small" className="text-center text-secondary-text">
              Failed to load announcements. Pull to retry.
            </Typography>
          </View>
        ) : (
          <FlatList
            data={allItems}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <FeedCard
                item={item}
                onPress={() => router.push(`/pet/${item.id}`)}
              />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
            ListEmptyComponent={
              <View className="mt-16 items-center gap-3">
                <Ionicons name="search-outline" size={48} color="#C4C4C4" />
                <Typography variant="body-small" className="text-center text-secondary-text">
                  No announcements found.{"\n"}Try adjusting your filters.
                </Typography>
              </View>
            }
            ListFooterComponent={
              isFetchingMore ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color="#F2C94C" />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}
