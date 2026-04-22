using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class PetDescriptionAndNotificationPreferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PetAge",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "Size",
                table: "Pets");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Pets",
                type: "character varying(4000)",
                maxLength: 4000,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PetAgeCategory",
                table: "Pets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PetSize",
                table: "Pets",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "NotificationChannelPreference",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
      ***REMOVED***

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Description",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "PetAgeCategory",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "PetSize",
                table: "Pets");

            migrationBuilder.DropColumn(
                name: "NotificationChannelPreference",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "PetAge",
                table: "Pets",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Size",
                table: "Pets",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);
      ***REMOVED***
  ***REMOVED***
}
