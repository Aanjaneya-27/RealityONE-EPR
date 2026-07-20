import { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronRight,
  ChevronLeft,
  Ruler,
  Compass,
  Eye,
  Heart,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  MapPin,
  Printer,
  Map as MapIcon,
  Lock,
  Camera,
  RotateCw,
  Waves,
  Cpu,
  Car,
  ChefHat,
  ArrowUpDown,
  Sun,
  Building2,
  Thermometer,
  Info,
  Phone,
  Mail,
  Share2,
  Check,
} from "lucide-react";

const TABS = ["Villas", "Apartments", "Duplexes"];
const TAB_TYPE_MAP = { Villas: "Villa", Apartments: "Apartment", Duplexes: "Duplex" };

const PRICE_RANGES = [
  { label: "Price Range", min: 0, max: Infinity },
  { label: "$100k - $250k", min: 100000, max: 250000 },
  { label: "$250k - $500k", min: 250000, max: 500000 },
  { label: "$500k+", min: 500000, max: Infinity },
];

const EMERALD_BAY_PROPERTIES = [
  {
    id: "E-204",
    title: "Villa #E-204",
    type: "Villa",
    price: "$368,500",
    priceValue: 368500,
    location: "Emerald Bay North Cove",
    status: "Available",
    area: "2,650 sq.ft",
    facing: "East Facing",
    tags: ["LAKE VIEW", "NEAR MARINA"],
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1764526624453-db32c24eca55?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1760072513376-67a46aab0fd1?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1722349672541-50fcfb6e2670?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1764551322786-54a994923d8f?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    pin: { top: "22%", left: "24%" },
  },
  {
    id: "E-118",
    title: "Villa #E-118",
    type: "Villa",
    price: "$455,000",
    priceValue: 455000,
    location: "Emerald Bay East Point",
    status: "Booked",
    area: "3,050 sq.ft",
    facing: "North Facing",
    tags: ["CORNER PLOT"],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1759239572496-4ec13e7643d6?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1752407828784-67a92663c866?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1681194189961-e2aa414f9c7f?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1723259457564-f576f1407fea?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#444651]",
    pin: { top: "58%", left: "62%" },
  },
  {
    id: "F-56",
    title: "Duplex #F-56",
    type: "Duplex",
    price: "$305,000",
    priceValue: 305000,
    location: "Emerald Bay Garden Court",
    status: "Available",
    area: "1,950 sq.ft",
    facing: "West Facing",
    tags: ["NEAR SPA", "EV CHARGING"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1764526624453-db32c24eca55?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1760072513376-67a46aab0fd1?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1722349672541-50fcfb6e2670?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1764551322786-54a994923d8f?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    pin: { top: "40%", left: "18%" },
  },
  {
    id: "G-312",
    title: "Apartment #G-312",
    type: "Apartment",
    price: "$412,000",
    priceValue: 412000,
    location: "Emerald Bay West Tower",
    status: "Available",
    area: "2,100 sq.ft",
    facing: "South Facing",
    tags: ["HIGH FLOOR", "POOL VIEW"],
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1759239572496-4ec13e7643d6?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1752407828784-67a92663c866?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1681194189961-e2aa414f9c7f?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1723259457564-f576f1407fea?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    pin: { top: "30%", left: "78%" },
  },
  {
    id: "H-77",
    title: "Villa #H-77",
    type: "Villa",
    price: "$610,000",
    priceValue: 610000,
    location: "Emerald Bay Palm Grove",
    status: "Booked",
    area: "3,400 sq.ft",
    facing: "North-East Facing",
    tags: ["PRIVATE GARDEN"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1764526624453-db32c24eca55?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1760072513376-67a46aab0fd1?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1722349672541-50fcfb6e2670?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1764551322786-54a994923d8f?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#444651]",
    pin: { top: "72%", left: "30%" },
  },
  {
    id: "J-19",
    title: "Duplex #J-19",
    type: "Duplex",
    price: "$289,500",
    priceValue: 289500,
    location: "Emerald Bay Sunset Court",
    status: "Available",
    area: "1,780 sq.ft",
    facing: "West Facing",
    tags: ["NEAR CLUBHOUSE", "EV CHARGING"],
    image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1759239572496-4ec13e7643d6?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1752407828784-67a92663c866?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1681194189961-e2aa414f9c7f?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1723259457564-f576f1407fea?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    pin: { top: "80%", left: "70%" },
  },
];

const HORIZON_HEIGHTS_PROPERTIES = [
  {
    id: "HH-101",
    title: "Apartment #HH-101",
    type: "Apartment",
    price: "$185,000",
    priceValue: 185000,
    location: "Horizon Heights, Floor 1",
    status: "Available",
    area: "1,150 sq.ft",
    facing: "East Facing",
    tags: ["2 BHK", "LOW FLOOR"],
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1764526624453-db32c24eca55?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1760072513376-67a46aab0fd1?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1722349672541-50fcfb6e2670?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1764551322786-54a994923d8f?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    floor: 1,
    pin: { top: "78%", left: "35%" },
  },
  {
    id: "HH-205",
    title: "Apartment #HH-205",
    type: "Apartment",
    price: "$265,000",
    priceValue: 265000,
    location: "Horizon Heights, Floor 2",
    status: "Available",
    area: "1,620 sq.ft",
    facing: "South Facing",
    tags: ["3 BHK", "POOL VIEW"],
    image: "https://images.unsplash.com/photo-1757970326337-95d7cca56fa1?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1759239572496-4ec13e7643d6?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1752407828784-67a92663c866?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1681194189961-e2aa414f9c7f?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1723259457564-f576f1407fea?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    floor: 2,
    pin: { top: "64%", left: "55%" },
  },
  {
    id: "HH-310",
    title: "Apartment #HH-310",
    type: "Apartment",
    price: "$340,000",
    priceValue: 340000,
    location: "Horizon Heights, Floor 3",
    status: "Booked",
    area: "2,050 sq.ft",
    facing: "North Facing",
    tags: ["4 BHK", "HIGH FLOOR"],
    image: "https://images.unsplash.com/photo-1768638687896-35bde623d532?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1764526624453-db32c24eca55?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1760072513376-67a46aab0fd1?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1722349672541-50fcfb6e2670?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1764551322786-54a994923d8f?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#444651]",
    floor: 3,
    pin: { top: "50%", left: "42%" },
  },
  {
    id: "HH-412",
    title: "Apartment #HH-412",
    type: "Apartment",
    price: "$198,000",
    priceValue: 198000,
    location: "Horizon Heights, Floor 4",
    status: "Available",
    area: "1,180 sq.ft",
    facing: "West Facing",
    tags: ["2 BHK", "CITY VIEW"],
    image: "https://images.unsplash.com/photo-1755103114153-eb0a66e3725a?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1759239572496-4ec13e7643d6?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1752407828784-67a92663c866?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1681194189961-e2aa414f9c7f?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1723259457564-f576f1407fea?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    floor: 4,
    pin: { top: "37%", left: "60%" },
  },
  {
    id: "HH-501",
    title: "Apartment #HH-501",
    type: "Apartment",
    price: "$278,000",
    priceValue: 278000,
    location: "Horizon Heights, Floor 5",
    status: "Available",
    area: "1,650 sq.ft",
    facing: "East Facing",
    tags: ["3 BHK", "CORNER UNIT"],
    image: "https://images.unsplash.com/photo-1755735340764-3b077cab0c5c?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1764526624453-db32c24eca55?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1760072513376-67a46aab0fd1?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1722349672541-50fcfb6e2670?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1764551322786-54a994923d8f?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    floor: 5,
    pin: { top: "24%", left: "48%" },
  },
  {
    id: "HH-604",
    title: "Apartment #HH-604",
    type: "Apartment",
    price: "$355,000",
    priceValue: 355000,
    location: "Horizon Heights, Floor 6",
    status: "Booked",
    area: "2,100 sq.ft",
    facing: "South Facing",
    tags: ["4 BHK", "PENTHOUSE"],
    image: "https://images.unsplash.com/photo-1757372429884-92e02350c5d9?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1759239572496-4ec13e7643d6?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1752407828784-67a92663c866?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1681194189961-e2aa414f9c7f?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1723259457564-f576f1407fea?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#444651]",
    floor: 6,
    pin: { top: "12%", left: "33%" },
  },
];

const OAKWOOD_ESTATES_PROPERTIES = [
  {
    id: "OAK-A12",
    title: "Villa #OAK-A12",
    type: "Villa",
    price: "$420,000",
    priceValue: 420000,
    location: "Oakwood Estates, Sector A",
    status: "Available",
    area: "2,800 sq.ft",
    facing: "North Facing",
    tags: ["GOLF VIEW", "4 BED"],
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1764526624453-db32c24eca55?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1760072513376-67a46aab0fd1?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1722349672541-50fcfb6e2670?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1764551322786-54a994923d8f?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    pin: { top: "16%", left: "18%" },
  },
  {
    id: "OAK-B07",
    title: "Villa #OAK-B07",
    type: "Villa",
    price: "$510,000",
    priceValue: 510000,
    location: "Oakwood Estates, Sector B",
    status: "Booked",
    area: "3,200 sq.ft",
    facing: "East Facing",
    tags: ["LAKE VIEW"],
    image: "https://images.unsplash.com/photo-1660361338523-b0609a02bf63?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1759239572496-4ec13e7643d6?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1752407828784-67a92663c866?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1681194189961-e2aa414f9c7f?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1723259457564-f576f1407fea?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#444651]",
    pin: { top: "16%", left: "78%" },
  },
  {
    id: "OAK-C03",
    title: "Villa #OAK-C03",
    type: "Villa",
    price: "$375,000",
    priceValue: 375000,
    location: "Oakwood Estates, Sector C",
    status: "Available",
    area: "2,400 sq.ft",
    facing: "West Facing",
    tags: ["GATED COMMUNITY", "3 BED"],
    image: "https://images.unsplash.com/photo-1759062012140-b6bec419fde8?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1764526624453-db32c24eca55?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1760072513376-67a46aab0fd1?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1722349672541-50fcfb6e2670?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1764551322786-54a994923d8f?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    pin: { top: "50%", left: "14%" },
  },
  {
    id: "OAK-D21",
    title: "Villa #OAK-D21",
    type: "Villa",
    price: "$465,000",
    priceValue: 465000,
    location: "Oakwood Estates, Sector D",
    status: "Available",
    area: "2,950 sq.ft",
    facing: "South Facing",
    tags: ["CORNER PLOT"],
    image: "https://images.unsplash.com/photo-1759372945658-1e9f56e751bd?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1759239572496-4ec13e7643d6?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1752407828784-67a92663c866?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1681194189961-e2aa414f9c7f?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1723259457564-f576f1407fea?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    pin: { top: "50%", left: "84%" },
  },
  {
    id: "OAK-E15",
    title: "Villa #OAK-E15",
    type: "Villa",
    price: "$590,000",
    priceValue: 590000,
    location: "Oakwood Estates, Sector E",
    status: "Booked",
    area: "3,600 sq.ft",
    facing: "North-East Facing",
    tags: ["PRIVATE POOL"],
    image: "https://images.unsplash.com/photo-1596082355170-14936e5ab7b4?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1764526624453-db32c24eca55?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1760072513376-67a46aab0fd1?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1722349672541-50fcfb6e2670?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1764551322786-54a994923d8f?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#444651]",
    pin: { top: "84%", left: "24%" },
  },
  {
    id: "OAK-F09",
    title: "Villa #OAK-F09",
    type: "Villa",
    price: "$340,000",
    priceValue: 340000,
    location: "Oakwood Estates, Sector F",
    status: "Available",
    area: "2,100 sq.ft",
    facing: "West Facing",
    tags: ["NEAR CLUBHOUSE"],
    image: "https://images.unsplash.com/photo-1470214203634-e436a8848e23?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1759239572496-4ec13e7643d6?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1752407828784-67a92663c866?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1681194189961-e2aa414f9c7f?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1723259457564-f576f1407fea?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    pin: { top: "84%", left: "76%" },
  },
];

const WELLINGTON_ESTATES_PROPERTIES = [
  {
    id: "WEL-01",
    title: "Villa #WEL-01",
    type: "Villa",
    price: "$448,000",
    priceValue: 448000,
    location: "Wellington Estates, Block 1",
    status: "Available",
    area: "2,700 sq.ft",
    facing: "East Facing",
    tags: ["PARK FACING", "4 BED"],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1764526624453-db32c24eca55?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1760072513376-67a46aab0fd1?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1722349672541-50fcfb6e2670?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1764551322786-54a994923d8f?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    pin: { top: "18%", left: "14%" },
  },
  {
    id: "WEL-02",
    title: "Villa #WEL-02",
    type: "Villa",
    price: "$525,000",
    priceValue: 525000,
    location: "Wellington Estates, Block 2",
    status: "Booked",
    area: "3,100 sq.ft",
    facing: "North Facing",
    tags: ["LAKE ACCESS"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1759239572496-4ec13e7643d6?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1752407828784-67a92663c866?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1681194189961-e2aa414f9c7f?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1723259457564-f576f1407fea?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#444651]",
    pin: { top: "18%", left: "80%" },
  },
  {
    id: "WEL-03",
    title: "Villa #WEL-03",
    type: "Villa",
    price: "$389,000",
    priceValue: 389000,
    location: "Wellington Estates, Block 3",
    status: "Available",
    area: "2,350 sq.ft",
    facing: "South Facing",
    tags: ["GATED COMMUNITY"],
    image: "https://images.unsplash.com/photo-1660361338523-b0609a02bf63?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1764526624453-db32c24eca55?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1760072513376-67a46aab0fd1?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1722349672541-50fcfb6e2670?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1764551322786-54a994923d8f?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    pin: { top: "50%", left: "18%" },
  },
  {
    id: "WEL-04",
    title: "Villa #WEL-04",
    type: "Villa",
    price: "$472,000",
    priceValue: 472000,
    location: "Wellington Estates, Block 4",
    status: "Available",
    area: "2,900 sq.ft",
    facing: "West Facing",
    tags: ["CORNER PLOT", "3 BED"],
    image: "https://images.unsplash.com/photo-1759062012140-b6bec419fde8?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1759239572496-4ec13e7643d6?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1752407828784-67a92663c866?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1681194189961-e2aa414f9c7f?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1723259457564-f576f1407fea?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    pin: { top: "50%", left: "80%" },
  },
  {
    id: "WEL-05",
    title: "Villa #WEL-05",
    type: "Villa",
    price: "$615,000",
    priceValue: 615000,
    location: "Wellington Estates, Block 5",
    status: "Booked",
    area: "3,500 sq.ft",
    facing: "North-East Facing",
    tags: ["PRIVATE GARDEN"],
    image: "https://images.unsplash.com/photo-1759372945658-1e9f56e751bd?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1764526624453-db32c24eca55?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1760072513376-67a46aab0fd1?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1722349672541-50fcfb6e2670?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1764551322786-54a994923d8f?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#444651]",
    pin: { top: "82%", left: "22%" },
  },
  {
    id: "WEL-06",
    title: "Villa #WEL-06",
    type: "Villa",
    price: "$356,000",
    priceValue: 356000,
    location: "Wellington Estates, Block 6",
    status: "Available",
    area: "2,050 sq.ft",
    facing: "East Facing",
    tags: ["NEAR CLUBHOUSE"],
    image: "https://images.unsplash.com/photo-1596082355170-14936e5ab7b4?q=80&w=900&auto=format&fit=crop",
    interiors: ["https://images.unsplash.com/photo-1759239572496-4ec13e7643d6?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1752407828784-67a92663c866?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1681194189961-e2aa414f9c7f?q=80&w=900&auto=format&fit=crop", "https://images.unsplash.com/photo-1723259457564-f576f1407fea?q=80&w=900&auto=format&fit=crop"],
    priceColor: "text-[#012c7e]",
    pin: { top: "82%", left: "76%" },
  },
];

const PROJECTS = {
  "Emerald Bay Residences": {
    subtitle: "Coastal District",
    mapType: "photo",
    mapImage: "https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=1200&auto=format&fit=crop",
    properties: EMERALD_BAY_PROPERTIES,
  },
  "Horizon Heights": {
    subtitle: "Full tower — 2, 3 & 4 BHK",
    mapType: "photo",
    mapImage: "https://images.unsplash.com/photo-1504494645474-cc4e25299579?q=80&w=1200&auto=format&fit=crop",
    properties: HORIZON_HEIGHTS_PROPERTIES,
  },
  "Oakwood Estates": {
    subtitle: "Villa community",
    mapType: "photo",
    mapImage: "https://images.unsplash.com/photo-1637123433690-228bb002d9e9?q=80&w=1200&auto=format&fit=crop",
    properties: OAKWOOD_ESTATES_PROPERTIES,
  },
  "Wellington Estates": {
    subtitle: "Villa community",
    mapType: "photo",
    mapImage: "https://images.unsplash.com/photo-1549394325-53f5ea5f4f51?q=80&w=1200&auto=format&fit=crop",
    properties: WELLINGTON_ESTATES_PROPERTIES,
  },
};

const PROJECT_NAMES = Object.keys(PROJECTS);

// Given a property, find which project it belongs to (used so Property
// Details always shows that project's own map, not a fixed one).
function findProjectForProperty(property) {
  if (!property) return null;
  for (const name of PROJECT_NAMES) {
    const proj = PROJECTS[name];
    if (proj.properties.some((p) => p.id === property.id)) {
      return { name, ...proj };
    }
  }
  return null;
}

const THUMBS = [
  { seed: "kitchen", label: "Kitchen" },
  { seed: "bedroom", label: "Master Bedroom" },
  { seed: "balcony", label: "Balcony" },
  { seed: "bathroom", label: "Bathroom" },
];

const AMENITIES = [
  { icon: Waves, label: "Infinity Pool" },
  { icon: Cpu, label: "Smart Home" },
  { icon: Car, label: "3 Parking Spots" },
  { icon: ChefHat, label: "Bosch Appliances" },
  { icon: ArrowUpDown, label: "Private Lift" },
  { icon: Sun, label: "Solar Backup" },
  { icon: Building2, label: "Wrap-around Balcony" },
  { icon: Thermometer, label: "Climate Control" },
];

const SPECS = [
  { label: "Area Size", value: "3,180 Sq.Ft", sub: "Built-up Area" },
  { label: "Facing", value: "South-West", sub: "Corner Unit" },
  { label: "Bedrooms", value: "3 + Study", sub: "All En-suite" },
  { label: "PLC", value: "Prime", sub: "Ocean + Marina View" },
];

// ---------------------------------------------------------------------------
// Status pill used on property cards
// ---------------------------------------------------------------------------
function StatusBadge({ status }) {
  const map = {
    Available: "bg-[#16a34a]", // emerald-600 replacement
    Booked: "bg-amber-500",
  };
  return (
    <div className={`absolute top-4 right-4 ${map[status]} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
      {status}
    </div>
  );
}

function PropertyCard({ p, onViewDetails }) {
  const booked = p.status === "Booked";
  return (
    <div className={`bg-white border border-[#c4c6d3] rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col ${booked ? "opacity-90" : ""}`}>
      <div className={`h-48 relative overflow-hidden ${booked ? "grayscale-[0.5]" : ""}`}>
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          alt={p.title}
          src={p.image}
        />
        <StatusBadge status={p.status} />
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md border border-[#e3e2e9] px-3 py-1.5 rounded-lg">
          <span className="text-xs font-bold text-[#1a1b21]">{p.title}</span>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h5 className={`font-semibold text-xl ${p.priceColor}`}>{p.price}</h5>
            <p className="text-[#444651] text-sm">{p.location}</p>
          </div>
          {booked ? (
            <div className="flex items-center gap-2 text-amber-600">
              <ShieldCheck size={18} />
              <span className="text-[10px] font-bold">RESERVED</span>
            </div>
          ) : (
            <button className="w-10 h-10 rounded-full border border-[#c4c6d3] flex items-center justify-center hover:bg-[#eeedf5] transition-colors">
              <Heart size={18} />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Ruler size={18} className="text-[#747683]" />
            <span className="text-sm font-semibold">{p.area}</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-[#747683]" />
            <span className="text-sm font-semibold">{p.facing}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-8">
          {p.tags.map((t) => (
            <span key={t} className="px-2 py-1 bg-[#eeedf5] rounded text-[10px] font-bold text-[#444651]">
              {t}
            </span>
          ))}
        </div>
        <div className="mt-auto flex gap-2">
          {booked ? (
            <button className="flex-1 py-2.5 bg-[#eeedf5] text-[#444651] rounded-xl text-sm font-semibold cursor-not-allowed">
              Locked for Booking
            </button>
          ) : (
            <button className="flex-1 py-2.5 bg-[#012c7e] text-white rounded-xl text-sm font-semibold hover:bg-[#254495] transition-all shadow-sm">
              Quick Book
            </button>
          )}
          <button
            onClick={() => onViewDetails(p)}
            className="px-3 py-2.5 bg-white border border-[#c4c6d3] text-[#1a1b21] rounded-xl hover:bg-[#eeedf5] transition-all"
          >
            <Eye size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function InventoryView({ onViewDetails }) {
  const [activeProject, setActiveProject] = useState(PROJECT_NAMES[0]);
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [priceFilter, setPriceFilter] = useState(PRICE_RANGES[0].label);

  const currentProject = PROJECTS[activeProject];

  // Which tabs make sense for this project (e.g. Horizon Heights only has Apartments)
  const availableTypes = useMemo(
    () => Array.from(new Set(currentProject.properties.map((p) => p.type))),
    [currentProject]
  );
  const tabsForProject = TABS.filter((t) => availableTypes.includes(TAB_TYPE_MAP[t]));

  const [activeTab, setActiveTab] = useState(tabsForProject[0] || TABS[0]);

  // Reset the active tab when the project changes — done during render (React's
  // recommended pattern for "adjusting state when a prop/value changes"),
  // not inside an effect, so it doesn't trigger a cascading setState-in-effect render.
  const [lastProject, setLastProject] = useState(activeProject);
  if (activeProject !== lastProject) {
    setLastProject(activeProject);
    setActiveTab(tabsForProject[0] || TABS[0]);
  }

  const selectedRange = PRICE_RANGES.find((r) => r.label === priceFilter) || PRICE_RANGES[0];
  const filteredProperties = currentProject.properties.filter(
    (p) => p.type === TAB_TYPE_MAP[activeTab] && p.priceValue >= selectedRange.min && p.priceValue <= selectedRange.max
  );

  const handleSelectProject = (name) => {
    setActiveProject(name);
    setProjectMenuOpen(false);
  };

  return (
    <div className="bg-[#faf8ff] text-[#1a1b21] min-h-screen font-sans">
      <main className="w-full max-w-[2000px] mx-auto p-4 sm:p-8 lg:p-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <nav className="flex items-center gap-2 text-[#444651]/60 text-sm mb-2 font-medium">
              <span>Inventory</span>
              <ChevronRight size={16} />
              <span>{activeProject}</span>
            </nav>
            <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#012c7e] mb-2 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Property Details &amp; Inventory
            </h2>
            <p className="text-[#444651] max-w-2xl text-sm sm:text-base">
              Real-time visualization of unit availability across all projects. Use the project
              filter on the map to switch between Emerald Bay Residences, Horizon Heights, Oakwood
              Estates and Wellington Estates.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#c4c6d3] text-[#1a1b21] rounded-xl hover:bg-[#eeedf5] transition-all font-semibold text-sm shadow-sm">
              <Filter size={18} /> Filters
            </button>
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#c4c6d3] text-[#1a1b21] rounded-xl hover:bg-[#eeedf5] transition-all font-semibold text-sm shadow-sm">
              <Download size={18} /> Export PDF
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          <div className="lg:col-span-8 bg-white border border-[#c4c6d3] rounded-[24px] shadow-sm relative group">
            <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
              <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[12px] font-bold text-[#012c7e] flex items-center gap-2 border border-[#c4c6d3]/50 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#012c7e] animate-pulse"></span>
                LIVE INTERACTIVE VIEW
              </span>
            </div>

            {/* Project filter / switcher */}
            <div className="absolute top-6 right-6 z-10">
              <button
                onClick={() => setProjectMenuOpen((o) => !o)}
                className="flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-2 rounded-xl text-xs font-bold text-[#012c7e] border border-[#c4c6d3]/60 shadow-sm hover:bg-white transition-all"
              >
                <Filter size={14} />
                {activeProject}
                <ChevronRight size={14} className={`transition-transform duration-200 ${projectMenuOpen ? "rotate-90" : ""}`} />
              </button>
              {projectMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[5]" onClick={() => setProjectMenuOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-[#c4c6d3] rounded-xl shadow-xl overflow-hidden z-10">
                    <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#747683] bg-[#f4f3fa] border-b border-[#e3e2e9]">
                      Select a Project
                    </div>
                    {PROJECT_NAMES.map((name) => (
                      <button
                        key={name}
                        onClick={() => handleSelectProject(name)}
                        className={`w-full text-left px-4 py-3 transition-colors flex items-center justify-between gap-3 ${
                          activeProject === name ? "bg-[#012c7e] text-white" : "text-[#1a1b21] hover:bg-[#eeedf5]"
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-bold leading-tight">{name}</span>
                          <span className={`block text-[11px] font-medium leading-tight ${activeProject === name ? "text-white/70" : "text-[#747683]"}`}>
                            {PROJECTS[name].subtitle}
                          </span>
                        </span>
                        {activeProject === name && <Check size={16} className="flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="absolute bottom-6 left-6 z-10 bg-white/80 backdrop-blur-md border border-[#e3e2e9] p-4 rounded-xl flex items-center gap-4 sm:gap-6 flex-wrap shadow-lg">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#16a34a]"></div>
                <span className="text-xs font-bold text-[#1a1b21]">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span className="text-xs font-bold text-[#1a1b21]">Booked</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ba1a1a]"></div>
                <span className="text-xs font-bold text-[#1a1b21]">Blocked</span>
              </div>
            </div>
            <div key={activeProject} className="h-[360px] sm:h-[460px] lg:h-[560px] w-full bg-[#f4f3fa] flex items-center justify-center relative overflow-hidden rounded-[23px]">
              <div className="absolute inset-0 opacity-60 mix-blend-multiply pointer-events-none">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${currentProject.mapImage}')` }}
                ></div>
              </div>
              <div className="relative w-full h-full flex items-center justify-center">
                {currentProject.properties.map((p) => {
                  const available = p.status === "Available";
                  const isHorizonHeights = activeProject === "Horizon Heights";
                  return (
                    <button
                      key={p.id}
                      onClick={() => onViewDetails(p)}
                      className={`absolute group/pin cursor-pointer transition-transform duration-200 hover:scale-110 hover:z-10 ${
                        isHorizonHeights ? "-translate-x-1/2 -translate-y-1/2" : ""
                      }`}
                      style={{ top: p.pin.top, left: p.pin.left }}
                    >
                      {isHorizonHeights ? (
                        <div
                          className={`w-14 h-14 rounded-xl overflow-hidden shadow-lg border-2 relative ${
                            available ? "border-[#16a34a]" : "border-amber-500"
                          }`}
                        >
                          <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                          <div className={`absolute inset-0 ${available ? "bg-[#16a34a]/10" : "bg-black/30"}`}></div>
                          <div
                            className={`absolute bottom-0 left-0 right-0 flex items-center justify-center gap-1 py-0.5 text-white ${
                              available ? "bg-[#16a34a]" : "bg-amber-500"
                            }`}
                          >
                            <Building2 size={10} />
                            <span className="text-[8px] font-extrabold">F{p.floor}</span>
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shadow-lg border-2 ${
                            available ? "bg-[#16a34a]/30 border-[#16a34a]" : "bg-amber-500/30 border-amber-500"
                          }`}
                        >
                          <div className={`w-2 h-2 rounded-full ${available ? "bg-[#16a34a]" : "bg-amber-500"}`}></div>
                        </div>
                      )}
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden group-hover/pin:block w-40 bg-white/90 backdrop-blur-md border border-[#e3e2e9] p-3 rounded-xl shadow-xl z-10 text-left">
                        <p className={`text-[11px] font-bold ${available ? "text-[#012c7e]" : "text-amber-700"}`}>{p.title}</p>
                        <p className="text-[10px] text-[#444651]">{p.area} | {p.facing}</p>
                        <p className="text-[12px] font-extrabold text-[#1a1b21] mt-1">{p.price}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="absolute inset-0 pointer-events-none border-[12px] border-white/50"></div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#012c7e] text-white p-6 sm:p-8 rounded-[24px] shadow-lg flex-1 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <TrendingUp size={200} />
              </div>
              <h3 className="font-semibold text-xl mb-6 relative z-10" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Inventory Summary</h3>
              <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex justify-between text-white/70 text-sm mb-2 font-medium">
                    <span>Total Occupancy</span>
                    <span>68%</span>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: "68%" }}></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/10">
                    <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mb-1">Available</p>
                    <p className="text-2xl font-bold">96</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur p-4 rounded-xl border border-white/10">
                    <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mb-1">Reserved</p>
                    <p className="text-2xl font-bold">41</p>
                  </div>
                </div>
                <button className="w-full py-3 bg-white text-[#012c7e] rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-sm">
                  View Detailed Report
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <div className="bg-white border border-[#c4c6d3] p-6 rounded-[24px] shadow-sm">
              <h4 className="font-semibold text-xl text-[#1a1b21] mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Price Insights</h4>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#1a53c8]/10 rounded-xl flex items-center justify-center text-[#1a53c8]">
                  <TrendingUp size={22} />
                </div>
                <div>
                  <p className="text-sm text-[#444651] font-medium">Avg. Square Foot Price</p>
                  <p className="text-xl font-bold text-[#1a1b21]">
                    $138.20 <span className="text-[#16a34a] text-xs font-bold bg-[#16a34a]/10 px-2 py-0.5 rounded ml-1">+3.1%</span>
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[#c4c6d3]/30">
                  <span className="text-sm text-[#444651]">Premium Facing Fee</span>
                  <span className="font-bold text-sm text-[#1a1b21]">+$12,000</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#c4c6d3]/30">
                  <span className="text-sm text-[#444651]">Corner Plot Surcharge</span>
                  <span className="font-bold text-sm text-[#1a1b21]">10%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <section className="mt-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#c4c6d3] mb-8 gap-4">
            <div className="flex gap-6 w-full md:w-auto overflow-x-auto hide-scrollbar">
              {tabsForProject.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative py-4 px-2 whitespace-nowrap transition-all border-b-2 text-sm ${
                    activeTab === tab
                      ? "text-[#012c7e] font-bold border-[#012c7e]"
                      : "text-[#444651] font-medium border-transparent hover:text-[#012c7e]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-3 pb-4 md:pb-0 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#747683]" />
                <input
                  className="w-full bg-white border border-[#c4c6d3] rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-[#012c7e] outline-none shadow-sm"
                  placeholder="Search Unit ID..."
                  type="text"
                />
              </div>
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="bg-white border border-[#c4c6d3] rounded-xl px-4 py-2 text-sm font-medium text-[#444651] outline-none focus:ring-1 focus:ring-[#012c7e] shadow-sm"
              >
                {PRICE_RANGES.map((r) => (
                  <option key={r.label}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map((p) => (
                <PropertyCard key={p.id} p={p} onViewDetails={onViewDetails} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-dashed border-[#c4c6d3] rounded-2xl py-16 text-center">
              <p className="text-sm font-semibold text-[#1a1b21]">No units in this price range.</p>
              <p className="text-xs text-[#444651] mt-1">Try a different tab or widen the price range.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function DetailsView({ property, onBack, mapImage }) {
  const [activeThumb, setActiveThumb] = useState(0);
  const [showActionBar, setShowActionBar] = useState(false);
  const booked = property?.status === "Booked";

  // Reveal the floating action bar only once the person has scrolled past the
  // photo gallery, instead of showing it immediately on page load.
  useEffect(() => {
    const handleScroll = () => setShowActionBar(window.scrollY > 480);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fallbackImg = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop";
  const interiors = property?.interiors || [];
  // Index 0 = the property's own exterior/hero shot; 1-4 = kitchen, bedroom, balcony, bathroom.
  const galleryImages = [property?.image || fallbackImg, ...interiors];
  const activeImage = galleryImages[activeThumb] || galleryImages[0];

  return (
    <div className="bg-[#faf8ff] text-[#1a1b21] min-h-screen font-sans pb-28">
      <main className="w-full max-w-[2000px] mx-auto p-4 sm:p-8 lg:p-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[#444651]/80 text-xs font-bold uppercase tracking-wider mb-2">
              <button onClick={onBack} className="hover:text-[#012c7e] transition-colors">
                Inventory
              </button>
              <ChevronRight size={14} />
              <span>{property?.location?.split(",")[0] || "Emerald Bay Residences"}</span>
              <ChevronRight size={14} />
              <span className="text-[#012c7e]">{property?.title || "Oceanview Suite B-07"}</span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span
                className={`px-3 py-1 text-[11px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5 border ${
                  booked
                    ? "bg-amber-50 text-amber-600 border-amber-500/20"
                    : "bg-[#dcfce7] text-[#15803d] border-[#16a34a]/20"
                }`}
              >
                <span className={`w-2 h-2 rounded-full animate-pulse ${booked ? "bg-amber-500" : "bg-[#15803d]"}`}></span>
                {property?.status || "Available"}
              </span>
              <span className="text-[#444651] text-xs font-semibold bg-white border border-[#c4c6d3] px-2.5 py-1 rounded-full">
                ID: #PRP-{property?.id || "EBR-B07"}
              </span>
            </div>
            <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-[#012c7e] mb-1 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {property?.title || "Oceanview Suite B-07"}
            </h2>
            <p className="text-[#444651] flex items-center gap-2 flex-wrap font-medium text-sm mt-2">
              <MapPin size={18} className="text-[#012c7e]" />
              {property?.location || "Emerald Bay Residences, Coastal District"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#c4c6d3] rounded-xl text-sm font-semibold hover:bg-[#f4f3fa] transition-all shadow-sm text-[#444651]">
              <Printer size={18} /> Print Brochure
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#c4c6d3] rounded-xl text-sm font-semibold hover:bg-[#f4f3fa] transition-all shadow-sm text-[#444651]">
              <MapIcon size={18} /> View Plan
            </button>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-[#012c7e] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#012c7e]/20 hover:scale-[1.02] active:scale-95 transition-all">
              <Lock size={18} /> Lock Booking
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-6">
            {/* Gallery */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#c4c6d3] shadow-sm relative group p-2">
              <div className="aspect-[16/9] w-full overflow-hidden relative rounded-xl">
                <img
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  alt={property?.title || "Oceanview Suite Interior"}
                  src={activeImage}
                />
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setActiveThumb((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 backdrop-blur-md text-white border border-white/40 flex items-center justify-center hover:bg-white/50 transition-colors shadow-lg"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setActiveThumb((i) => (i + 1) % galleryImages.length)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/30 backdrop-blur-md text-white border border-white/40 flex items-center justify-center hover:bg-white/50 transition-colors shadow-lg"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 flex gap-2 sm:gap-3 flex-wrap">
                  <span className="px-3 py-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/20 flex items-center gap-2">
                    <Camera size={16} /> {activeThumb + 1}/{galleryImages.length} Photos
                  </span>
                  <span className="px-3 py-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-lg border border-white/20 flex items-center gap-2 hover:bg-black/80 cursor-pointer">
                    <RotateCw size={16} /> Virtual Tour
                  </span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-5 gap-2">
                <div
                  onClick={() => setActiveThumb(0)}
                  className={`aspect-video rounded-lg overflow-hidden cursor-pointer transition-all relative ${
                    activeThumb === 0 ? "border-2 border-[#012c7e] ring-2 ring-[#012c7e]/10" : "hover:opacity-80"
                  }`}
                >
                  <img className="w-full h-full object-cover" alt={property?.title || "Exterior"} src={property?.image || fallbackImg} />
                </div>
                {THUMBS.map((t, i) => (
                  <div
                    key={t.seed}
                    onClick={() => setActiveThumb(i + 1)}
                    className={`aspect-video rounded-lg overflow-hidden cursor-pointer transition-all relative ${
                      activeThumb === i + 1 ? "border-2 border-[#012c7e] ring-2 ring-[#012c7e]/10" : "hover:opacity-80"
                    }`}
                  >
                    <img
                      className="w-full h-full object-cover"
                      alt={t.label}
                      src={interiors[i] || fallbackImg}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {SPECS.map((s) => (
                <div key={s.label} className="bg-white p-5 rounded-2xl border border-[#c4c6d3] shadow-sm">
                  <p className="text-[#444651]/70 text-[11px] uppercase tracking-widest font-bold mb-1">
                    {s.label}
                  </p>
                  <h4 className="font-bold text-lg sm:text-xl text-[#1a1b21]">{s.value}</h4>
                  <p className="text-xs text-[#444651] font-medium mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Amenities */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#c4c6d3] shadow-sm">
              <h3 className="font-bold text-xl text-[#012c7e] mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Unit Features &amp; Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
                {AMENITIES.map(({ icon: Icon, label }) => (
                  <div key={label} className="flex flex-col items-center text-center group cursor-default">
                    <div className="w-14 h-14 rounded-2xl bg-[#f4f3fa] border border-[#e3e2e9] flex items-center justify-center mb-3 text-[#012c7e] group-hover:bg-[#012c7e] group-hover:text-white transition-all duration-300 shadow-sm">
                      <Icon size={24} />
                    </div>
                    <span className="text-sm font-semibold text-[#1a1b21]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-6">
            {/* Pricing */}
            <div className="bg-[#012c7e] text-white p-6 sm:p-8 rounded-2xl border border-[#254495] shadow-xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
              <p className="text-[#a0b6ff] text-xs uppercase tracking-widest font-bold mb-2">Total Unit Value</p>
              <h3 className="font-bold text-4xl mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{property?.price || "$2,980,000"}</h3>
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80">Base Price</span>
                  <span className="font-bold">$2,650,000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80">PLC (Ocean View)</span>
                  <span className="font-bold">$180,000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80">Legal &amp; Registration</span>
                  <span className="font-bold">$12,000</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/80">Amenities Surcharge</span>
                  <span className="font-bold">$138,000</span>
                </div>
                <div className="pt-4 mt-2 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#a0b6ff]">Subtotal</span>
                  <span className="text-xl font-bold">{property?.price || "$2,980,000"}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-[#16a34a] bg-[#16a34a]/10 p-2 rounded-lg border border-[#16a34a]/20">
                  <span className="font-semibold">Taxes (5% VAT) Included</span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-white/10 rounded-xl border border-white/5">
                <p className="text-[11px] leading-relaxed font-medium text-white/80">
                  *This quote is valid for 48 hours. Booking requires a 10% initial deposit. Flexible payment plan (20:30:50).
                </p>
              </div>
            </div>

            {/* Master Plan Thumb */}
            <div className="bg-white p-6 rounded-2xl border border-[#c4c6d3] shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-[#444651]">Master Plan</h4>
                <button className="text-[#012c7e] text-xs font-bold hover:underline">Full View</button>
              </div>
              <div className="aspect-square rounded-xl overflow-hidden relative border border-[#c4c6d3] group">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt="Project master plan"
                  src={mapImage || "https://images.unsplash.com/photo-1524813686514-a57563d77965?q=80&w=700&auto=format&fit=crop"}
                />
                <div
                  className="absolute w-6 h-6 -ml-3 -mt-3"
                  style={{ top: property?.pin?.top || "35%", left: property?.pin?.left || "55%" }}
                >
                  <div className="absolute inset-0 bg-[#012c7e]/40 rounded-full animate-ping"></div>
                  <div className="absolute inset-1.5 bg-[#012c7e] rounded-full border-2 border-white shadow-md"></div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-[#f4f3fa] rounded-xl border border-[#c4c6d3]/30">
                <p className="text-xs text-[#444651] font-medium flex items-start gap-2 leading-relaxed">
                  <Info size={16} className="mt-0.5 flex-shrink-0 text-[#012c7e]" />
                  {property?.title || "This unit"} is located in {property?.location || "Emerald Bay Residences"}.
                </p>
              </div>
            </div>

            {/* Sales Contact */}
            <div className="bg-white p-6 rounded-2xl border border-[#c4c6d3] shadow-sm">
              <h4 className="text-xs uppercase tracking-widest font-bold text-[#444651] mb-4">Assigned Advisor</h4>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#e3e2e9] shadow-sm flex-shrink-0">
                  <img className="w-full h-full object-cover" alt="Priya Sharma" src="https://i.pravatar.cc/150?img=47" />
                </div>
                <div>
                  <p className="font-bold text-lg text-[#1a1b21] leading-tight mb-0.5">Priya Sharma</p>
                  <p className="text-[10px] text-[#012c7e] uppercase tracking-widest font-bold">Senior Relationship Manager</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 py-2.5 bg-white border border-[#c4c6d3] rounded-xl text-[#012c7e] font-bold text-xs hover:bg-[#f4f3fa] transition-colors shadow-sm">
                  <Phone size={16} /> Call
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 bg-[#012c7e] text-white border border-[#012c7e] rounded-xl font-bold text-xs hover:bg-[#254495] transition-colors shadow-sm">
                  <Mail size={16} /> Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Smart Action Bar — appears once you scroll past the gallery */}
      <div
        className={`fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 w-[92vw] sm:w-fit max-w-[95vw] bg-white/90 backdrop-blur-md border border-[#c4c6d3] px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-2xl z-[5] flex items-center justify-between sm:justify-start gap-4 sm:gap-8 transition-all duration-300 ${
          showActionBar ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="hidden md:flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#444651] leading-none mb-1">Current Status</span>
            <span className={`flex items-center gap-1.5 text-xs font-bold ${booked ? "text-amber-600" : "text-[#15803d]"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${booked ? "bg-amber-500" : "bg-[#16a34a]"}`}></span>
              {property?.status || "Available"}
            </span>
          </div>
          <div className="h-8 w-px bg-[#c4c6d3]"></div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#444651] leading-none mb-1">Unit Value</span>
            <span className="text-sm font-bold text-[#012c7e]">{property?.price || "$2,980,000"}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button className="p-2.5 bg-white border border-[#c4c6d3] rounded-xl hover:bg-[#f4f3fa] transition-colors shadow-sm text-[#444651]" title="Add to Shortlist">
            <Heart size={20} />
          </button>
          <button className="p-2.5 bg-white border border-[#c4c6d3] rounded-xl hover:bg-[#f4f3fa] transition-colors shadow-sm text-[#444651]" title="Share Detail">
            <Share2 size={20} />
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#012c7e] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#012c7e]/20 hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap">
            Generate Quotation
          </button>
        </div>
      </div>
    </div>
  );
}

// --- APP WRAPPER ---
export default function App() {
  const [view, setView] = useState("inventory");
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Font loader for accurate ERP typography
  useEffect(() => {
    const id = "realtyone-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setView("details");
  };

  const selectedPropertyProject = findProjectForProperty(selectedProperty);

  const handleBackToInventory = () => {
    setView("inventory");
  };

  return (
    <div className="min-h-screen bg-[#faf8ff] font-sans" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Dev Switcher - (Remove in real app routing) */}
      <div className="flex justify-center py-3 bg-[#faf8ff]/80 backdrop-blur-md border-b border-[#e3e2e9]">
        <div className="inline-flex bg-white border border-[#c4c6d3] rounded-full p-1 shadow-sm">
          <button
            onClick={handleBackToInventory}
            className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              view === "inventory" ? "bg-[#012c7e] text-white shadow-md" : "text-[#444651] hover:bg-[#f4f3fa]"
            }`}
          >
            Inventory View
          </button>
          <button
            onClick={() => setView("details")}
            className={`px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              view === "details" ? "bg-[#012c7e] text-white shadow-md" : "text-[#444651] hover:bg-[#f4f3fa]"
            }`}
          >
            Property Details
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {view === "inventory" ? (
        <InventoryView onViewDetails={handleViewDetails} />
      ) : (
        <DetailsView
          key={selectedProperty?.id || "default"}
          property={selectedProperty}
          onBack={handleBackToInventory}
          mapImage={selectedPropertyProject?.mapImage}
        />
      )}
    </div>
  );
}
