using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddAnnouncementProcessingAndVector : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ProcessingRetryCount",
                table: "Announcements",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProcessingStatus",
                table: "Announcements",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<double[]>(
                name: "Vector",
                table: "Announcements",
                type: "double precision[]",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "VectorizedOn",
                table: "Announcements",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Announcements_City_PetStatus",
                table: "Announcements",
                columns: new[] { "City", "PetStatus" });

            migrationBuilder.CreateIndex(
                name: "IX_Announcements_ProcessingStatus",
                table: "Announcements",
                column: "ProcessingStatus");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Announcements_City_PetStatus",
                table: "Announcements");

            migrationBuilder.DropIndex(
                name: "IX_Announcements_ProcessingStatus",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "ProcessingRetryCount",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "ProcessingStatus",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "Vector",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "VectorizedOn",
                table: "Announcements");
        }
    }
}
