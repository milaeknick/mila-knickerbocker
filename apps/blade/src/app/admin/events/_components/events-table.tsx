"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import type { ReturnEvent } from "@forge/db/schemas/knight-hacks";
import { Input } from "@forge/ui/input";
import { Label } from "@forge/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@forge/ui/table";

import { api } from "~/trpc/react";
import SortButton from "../../_components/SortButton";
import { CreateEventButton } from "./create-event";
import { DeleteEventButton } from "./delete-event";
import { UpdateEventButton } from "./update-event";
import { ViewAttendanceButton } from "./view-attendance-button";

type Event = ReturnEvent;
type SortField = keyof Event;
type SortOrder = "asc" | "desc" | null;

export function EventsTable() {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: events } = api.event.getEvents.useQuery();

  const filteredEvents = (events ?? []).filter((event) =>
    Object.values(event).some((value) => {
      if (value === null) return false;
      // Convert value to string for searching
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    }),
  );

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (!sortField || sortOrder === null) return 0;
    if (a[sortField] == null || b[sortField] == null) return 0;
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const getFormattedDate = (start_datetime: string | Date) => {
    const date = new Date(start_datetime);
    date.setDate(date.getDate() + 1);
    return date.toLocaleDateString();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2 border-b pb-2">
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-2 pb-2">
            <div className="relative w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <CreateEventButton />
          </div>
          <div className="whitespace-nowrap text-sm text-center font-bold">
            Returned {sortedEvents.length} events
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">
              <SortButton
                field="name"
                label="Name"
                sortField={sortField}
                sortOrder={sortOrder}
                setSortField={setSortField}
                setSortOrder={setSortOrder}
              />
            </TableHead>
            <TableHead className="text-center">
              <SortButton
                field="tag"
                label="Tag"
                sortField={sortField}
                sortOrder={sortOrder}
                setSortField={setSortField}
                setSortOrder={setSortOrder}
              />
            </TableHead>
            <TableHead className="text-center">
              <SortButton
                field="start_datetime"
                label="Date"
                sortField={sortField}
                sortOrder={sortOrder}
                setSortField={setSortField}
                setSortOrder={setSortOrder}
              />
            </TableHead>
            <TableHead>
              <SortButton
                field="location"
                label="Location"
                sortField={sortField}
                sortOrder={sortOrder}
                setSortField={setSortField}
                setSortOrder={setSortOrder}
              />
            </TableHead>
            <TableHead className="text-right">
              <SortButton
                field="numAttended"
                label="Attended"
                sortField={sortField}
                sortOrder={sortOrder}
                setSortField={setSortField}
                setSortOrder={setSortOrder}
              />
            </TableHead>
            <TableHead className="text-right">
              <Label>Update</Label>
            </TableHead>
            <TableHead className="text-right">
              <Label>Delete</Label>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sortedEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="text-center font-medium">
                {event.name}
              </TableCell>
              <TableCell className="text-center">{event.tag}</TableCell>

              <TableCell className="text-center">
                {getFormattedDate(event.start_datetime)}
              </TableCell>

              <TableCell>{event.location}</TableCell>

              <TableCell className="text-right">
                <ViewAttendanceButton
                  event={event}
                  numAttended={event.numAttended}
                />
              </TableCell>

              <TableCell className="text-right">
                <UpdateEventButton event={event} />
              </TableCell>

              <TableCell className="text-right">
                <DeleteEventButton event={event} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total Attendance</TableCell>
            <TableCell className="text-right">
              {sortedEvents.reduce((sum, event) => sum + event.numAttended, 0)}
            </TableCell>
            <TableCell colSpan={2} />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
