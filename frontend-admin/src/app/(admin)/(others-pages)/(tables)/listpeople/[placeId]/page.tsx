import React from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getPlaceById } from "@/services/places/placesAPI";
import ListPeopleMain from "@/components/PageComponents/listpeople/client/ListPeopleMain";
import ListPeopleNotification from "@/components/PageComponents/listpeople/client/ListPeopleNotification";

interface PageProps {
  params: Promise<{ placeId: string }>;
}

export default async function ListPeople({ params }: PageProps) {
  const { placeId } = await params;

  // Fetch place data on the server
  const place = await getPlaceById(placeId);

  return (
    <>
      <PageBreadcrumb pageTitle="ข้อมูลของคุณ" />
      <ListPeopleMain place={place} placeId={placeId} />
      <ListPeopleNotification />
    </>
  );
}
