using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class EnsureUniqueMatchNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications");

            migrationBuilder.Sql(
                """
                DELETE FROM "Notifications" AS duplicate
                USING "Notifications" AS original
                WHERE duplicate."Id" > original."Id"
                  AND duplicate."UserId" = original."UserId"
                  AND duplicate."MatchResultId" = original."MatchResultId"
                  AND duplicate."Type" = original."Type"
                  AND duplicate."MatchResultId" IS NOT NULL;
                """);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId_MatchResultId_Type",
                table: "Notifications",
                columns: new[] { "UserId", "MatchResultId", "Type" },
                unique: true,
                filter: "\"MatchResultId\" IS NOT NULL");
      ***REMOVED***

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Notifications_UserId_MatchResultId_Type",
                table: "Notifications");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");
      ***REMOVED***
  ***REMOVED***
}
