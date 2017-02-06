<?php
class CreateFirstRunDatafield extends Migration
{
    public function description()
    {
        return 'create a datafield to store whether Cliqr was already initialized in a course';
    }

    public function up()
    {
        $stmt = DBManager::get()->prepare(<<<'SQL'
            INSERT INTO `datafields` (
                `datafield_id`, `name`, `object_type`, `object_class`, `edit_perms`, `view_perms`,
                `priority`, `mkdate`, `chdate`, `type`, `typeparam`, `is_required`, `is_userfilter`,
                `description`, `system`
            ) VALUES (
                'f827bdf3f27b7d8001332fab89f1ed29', 'Cliqr: First Run Complete', 'sem', NULL, 'root', 'root',
                0, 1486243490, 1486243490, 'bool', '', 0, 0,
                'In diesem Datenfeld wird festgehalten, ob Cliqr in der entsprechenden Veranstaltung bereits initialisiert wurde', 0
            )
SQL
        );
        $stmt->execute([]);
    }

    public function down()
    {
        $stmt = DBManager::get()->prepare(<<<'SQL'
            DELETE FROM `datafields` WHERE `datafield_id` = 'f827bdf3f27b7d8001332fab89f1ed29'
SQL
        );
        $stmt->execute([]);
    }
}
