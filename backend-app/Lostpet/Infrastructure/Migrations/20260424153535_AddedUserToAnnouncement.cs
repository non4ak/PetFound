using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedUserToAnnouncement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Pets_AspNetUsers_UserId",
                table: "Pets");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Pets",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "ReporterUserId",
                table: "Announcements",
                type: "integer",
                nullable: true);

            migrationBuilder.Sql(
                """
                UPDATE "Announcements" AS a
                SET "ReporterUserId" = p."UserId"
                FROM "Pets" AS p
                WHERE a."PetId" = p."Id";
                """
            );

            migrationBuilder.Sql(
                """
                UPDATE "Announcements"
                SET "ReporterUserId" = (
                    SELECT MIN(u."Id")
                    FROM "AspNetUsers" AS u
                )
                WHERE "ReporterUserId" IS NULL;
                """
            );

            migrationBuilder.AlterColumn<int>(
                name: "ReporterUserId",
                table: "Announcements",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Announcements_ReporterUserId",
                table: "Announcements",
                column: "ReporterUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Announcements_AspNetUsers_ReporterUserId",
                table: "Announcements",
                column: "ReporterUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Pets_AspNetUsers_UserId",
                table: "Pets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Announcements_AspNetUsers_ReporterUserId",
                table: "Announcements");

            migrationBuilder.DropForeignKey(
                name: "FK_Pets_AspNetUsers_UserId",
                table: "Pets");

            migrationBuilder.DropIndex(
                name: "IX_Announcements_ReporterUserId",
                table: "Announcements");

            migrationBuilder.DropColumn(
                name: "ReporterUserId",
                table: "Announcements");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Pets",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Pets_AspNetUsers_UserId",
                table: "Pets",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
