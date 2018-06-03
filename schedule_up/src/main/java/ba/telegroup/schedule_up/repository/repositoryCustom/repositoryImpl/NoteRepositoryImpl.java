package ba.telegroup.schedule_up.repository.repositoryCustom.repositoryImpl;

import ba.telegroup.schedule_up.model.modelCustom.NoteUser;
import ba.telegroup.schedule_up.repository.repositoryCustom.NoteRepositoryCustom;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class NoteRepositoryImpl implements NoteRepositoryCustom {

    private static final String SQL_GET_ALL_EXTENDED = "SELECT n.id, n.name, n.description, n.publish_time, n.deleted, n.user_id, n.company_id, u.username FROM note n JOIN user u ON n.user_id=u.id WHERE n.company_id=? AND n.deleted=0 AND u.deleted=0";
    private static final String SQL_GET_ALL_EXTENDED_BY_ID = "SELECT n.id, n.name, n.description, n.publish_time, n.deleted, n.user_id, n.company_id, u.username FROM note n JOIN user u ON n.user_id=u.id WHERE n.company_id=? AND n.id=? AND n.deleted=0 AND u.deleted=0";
    private static final String SQL_GET_ALL_EXTENDED_BY_USER_ID = "SELECT n.id, n.name, n.description, n.publish_time, n.deleted, n.user_id, n.company_id, u.username FROM note n JOIN user u ON n.user_id=u.id WHERE n.company_id=? AND u.id=? AND n.deleted=0 AND u.deleted=0";
    private static final String SQL_GET_ALL_EXTENDED_BY_NAME_CONTAINS = "SELECT n.id, n.name, n.description, n.publish_time, n.deleted, n.user_id, n.company_id, u.username FROM note n JOIN user u ON n.user_id=u.id WHERE n.company_id=? AND LOWER(n.name) LIKE LOWER(?) AND n.deleted=0 AND u.deleted=0";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public List<NoteUser> getAllExtended(Integer companyId){
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED, "NoteUserMapping").setParameter(1,companyId).getResultList();
    }

    @Override
    public NoteUser getAllExtendedById(Integer companyId, Integer noteId){
        try {
            return (NoteUser) entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_ID, "NoteUserMapping").setParameter(1, companyId).setParameter(2,noteId).getSingleResult();
        } catch(Exception ex) {
            return null;
        }
    }

    @Override
    public List<NoteUser> getAllExtendedByUserId(Integer companyId, Integer userId){
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_USER_ID, "NoteUserMapping").setParameter(1,companyId).setParameter(2,userId).getResultList();
    }

    @Override
    public List<NoteUser> getAllExtendedByNameContains(Integer companyId, String name){
        return entityManager.createNativeQuery(SQL_GET_ALL_EXTENDED_BY_NAME_CONTAINS, "NoteUserMapping").setParameter(1,companyId).setParameter(2,"%" + name + "%").getResultList();
    }

}
