package ba.telegroup.schedule_up.repository.repositoryCustom;

import ba.telegroup.schedule_up.model.modelCustom.NoteUser;

import java.util.List;

public interface NoteRepositoryCustom {

    List<NoteUser> getAllExtended(Integer companyId);

    NoteUser getAllExtendedById(Integer companyId, Integer noteId);

    List<NoteUser> getAllExtendedByUserId(Integer companyId, Integer userId);

    List<NoteUser> getAllExtendedByNameContains(Integer companyId, String name);
}
