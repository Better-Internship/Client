import * as React from "react";
import { SearchBar } from "@/components/design-system/patterns/SearchBar";
import { Button } from "@/components/design-system/primitives/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system/primitives/Card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building } from "lucide-react";

/**
 * JobSearchForm Component
 * Example feature component using the new design system
 * Demonstrates unified patterns across the student portal
 */

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "internship" | "contract";
  posted: string;
  description: string;
  salary?: string;
}

interface JobSearchFormProps {
  onSearch?: (query: string) => void;
  onFilterToggle?: () => void;
  jobs?: Job[];
  loading?: boolean;
}

const JobSearchForm: React.FC<JobSearchFormProps> = ({
  onSearch,
  onFilterToggle,
  jobs = [],
  loading = false
}) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filtersActive, setFiltersActive] = React.useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    onSearch?.(query);
  };

  const handleFiltersToggle = () => {
    setFiltersActive(!filtersActive);
    onFilterToggle?.();
  };

  const getJobTypeColor = (type: Job["type"]) => {
    switch (type) {
      case "full-time": return "bg-green-100 text-green-800";
      case "part-time": return "bg-blue-100 text-blue-800";
      case "internship": return "bg-purple-100 text-purple-800";
      case "contract": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6" data-portal="student">
      {/* Search Header */}
      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect Internship</CardTitle>
        </CardHeader>
        <CardContent>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            onClear={() => setSearchQuery("")}
            placeholder="Search for internships, companies, or skills..."
            size="lg"
            showFilters={true}
            onFiltersToggle={handleFiltersToggle}
            filtersActive={filtersActive}
            portal="student"
          />
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {loading ? (
          // Skeleton loading state
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse-soft">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <Card key={job.id} hover="lift" className="transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        {job.company}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getJobTypeColor(job.type)}>
                      {job.type}
                    </Badge>
                    {job.salary && (
                      <span className="text-sm font-medium text-foreground">
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {job.description}
                </p>
                
                <div className="flex gap-2">
                  <Button size="sm" portal="student">
                    Apply Now
                  </Button>
                  <Button variant="outline" size="sm">
                    Save
                  </Button>
                  <Button variant="ghost" size="sm">
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No jobs found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export { JobSearchForm };
export type { JobSearchFormProps, Job };
