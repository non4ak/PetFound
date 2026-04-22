using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAnnouncementLocationAndTelegramFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ApproximateTime",
                table: "Announcements",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Announcements",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Announcements",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsTelegramActive",
                table: "Announcements",
                type: "boolean",
                nullable: false,
                defaultValue: false);
      ***REMOVED***

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApproximateTime",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "IsTelegramActive",
                table: "Announcements");
      ***REMOVED***
  ***REMOVED***
}
